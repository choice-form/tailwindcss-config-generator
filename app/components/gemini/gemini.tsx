import {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} from "@google/generative-ai";
import {Button, Input} from "@nextui-org/react";
import {reject} from "lodash";
import {useState} from "react";
import {UiPieChart} from "../ui";
import {DataTypes} from "../ui/ui-pie-chart";
import chroma from "chroma-js";

interface GeminiProps {}

type colorHarmonyType =
  | "analogous"
  | "monochromatic"
  | "triad"
  | "complementary"
  | "split complementary"
  | "double complementary"
  | "square"
  | "compound"
  | "shades";

export const Gemini = ({}: GeminiProps) => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  const [data, setData] = useState<string | undefined>();
  console.log("🚀 ~ file: gemini.tsx:59 ~ Gemini ~ data:", data);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [colorHarmony, setColorHarmony] = useState<colorHarmonyType>("analogous");

  async function fetchDataFromGeminiProAPI() {
    try {
      // ONLY TEXT
      if (!inputText) {
        alert("Please enter text!");
        return;
      }
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({model: "gemini-pro"});
      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const parts = [
        {
          text: "Generate the color palette from the input description",
        },
        {text: "input: 秋天的河边"},
        {
          text: "output: [{name: '柳垂翠影', color:'#606C38', ratio: 10},{name:'深林之墨', color:'#283618', ratio: 40},{name: '晓光之金', color:'#FEFAE0', ratio: 10},{name: '秋叶褐', color:'#DDA15E', ratio: 10},{name: '古铜棕', color:'#BC6C25', ratio: 30}]",
        },
        {
          text: `input: ${inputText}, ration of each color according to the primary or secondary color. The sum of all colors ration is 100. Give each color a poetic and elegant Chinese name that fits the color. The name should be as elegant as a Chinese poem. example: [{name:'name', color:'hex', ratio: number},{name:'name', color:'hex', ratio: number},{name:'name', color:'hex', ratio: number},{name:'name', color:'hex', ratio: number},{name:'name', color:'hex', ratio: number}], min 3 colors, max 8 colors.`,
        },
        {text: "output: "},
      ];

      const result = await model.generateContent({
        contents: [{role: "user", parts}],
        generationConfig,
        safetySettings,
      });

      const text = result.response.text();
      setLoading(false);
      setData(text);
    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  }

  async function fetchDataFromGeminiProVisionAPI() {
    try {
      // TEXT AND FILE
      if (!inputText) {
        alert("Please enter text!");
        return;
      }
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({model: "gemini-pro-vision"});

      const generationConfig = {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      };

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const fileInputEl = document.querySelector("input[type=file]") as HTMLInputElement;
      if (fileInputEl === null || fileInputEl.files === null) {
        alert("No file input element or no files selected");
        return;
      }
      const imageParts = await Promise.all([...fileInputEl.files].map(fileToGenerativePart));
      const result = await model.generateContent([
        `${inputText}, First, analyze the scene, content and atmosphere of this picture. Then analyze the color of this picture to obtain the main color, auxiliary color and contrast color of the picture. Combine the scene, content and atmosphere of the picture. Generate the corresponding color palette. example: ['#hex', '#hex', '#hex',...], min 3 colors, max 8 colors.`,
        ...imageParts,
      ]);
      const text = result.response.text();

      setLoading(false);
      setData(text);
    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  }

  async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve((reader.result as string).split(",")[1]);
        } else {
          reject(new Error("Reader result is null"));
        }
      };
      reader.readAsDataURL(file);
    });
    return {
      inlineData: {data: (await base64EncodedDataPromise) as string, mimeType: file.type},
    };
  }

  let matchedData = data?.match(/(?<=\[).+(?=\])/);

  let dataString = "";
  if (matchedData != null) {
    dataString = "[" + matchedData[0] + "]";
  }

  // 替换键和值中的单引号到双引号，产生合法的 JSON 字符串
  const validJsonString = dataString.replace(/'{|}'|','|color|name|ratio/g, (match) => {
    switch (match) {
      case "{":
        return '{"';
      case "}":
        return '}"';
      case ",":
        return '","';
      case "name":
        return '"name"';
      case "color":
        return '"color"';
      case "ratio":
        return '"ratio"';
      default:
        return match;
    }
  });

  let dataJSON;
  try {
    dataJSON = JSON.parse(validJsonString.replace(/'/g, '"'));
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Input labelPlacement="outside" type="file" />
      <Input
        placeholder="Write your prompt..."
        labelPlacement="outside"
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button isDisabled={loading} isLoading={loading} onClick={() => fetchDataFromGeminiProAPI()}>
        Get PRO data
      </Button>
      <Button
        isDisabled={loading}
        isLoading={loading}
        onClick={() => fetchDataFromGeminiProVisionAPI()}
      >
        Get PRO Vision data
      </Button>
      <select
        value={colorHarmony}
        onChange={(e) => setColorHarmony(e.target.value as colorHarmonyType)}
        disabled={loading}
        defaultValue={colorHarmony}
      >
        <option value="analogous">Analogous</option>
        <option value="monochromatic">Monochromatic</option>
        <option value="triad">Triad</option>
        <option value="complementary">Complementary</option>
        <option value="split complementary">Split Complementary</option>
        <option value="double complementary">Double Complementary</option>
        <option value="square">Square</option>
        <option value="compound">Compound</option>
        <option value="shades">Shades</option>
      </select>
      <div className="w-full">Response: {data}</div>
      {dataJSON && (
        <>
          <UiPieChart data={dataJSON} size={256} colorSummary={true} colorSpace="rgb" />
          <div className="grid grid-cols-[16rem_20rem_16rem] gap-4">
            <div
              className="p-8 rounded-xl overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${dataJSON
                  .slice(dataJSON.length - 2, dataJSON.length)
                  .map((item: DataTypes) => item.color)
                  .join(",")})`,
              }}
            ></div>

            <div
              className="grid rounded-xl overflow-hidden"
              style={{
                gridTemplateRows: `repeat(${dataJSON.length}, 1fr)`,
              }}
            >
              {dataJSON.map((item: DataTypes) => {
                const shadeColorReadable = chroma(item.color).luminance() > 0.5 ? "#000" : "#fff";
                return (
                  <div
                    className="p-8 grid grid-cols-[1fr_auto] gap-2 items-center text-sm"
                    style={{
                      color: shadeColorReadable,
                      backgroundColor: item.color,
                    }}
                  >
                    <span>{item.name}</span>
                    <span>{chroma.contrast(shadeColorReadable, item.color).toFixed(2)}:1</span>
                    <span>{item.color}</span>
                  </div>
                );
              })}
            </div>

            <div
              className="p-8 rounded-xl overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${dataJSON
                  .slice(0, 2)
                  .map((item: DataTypes) => item.color)
                  .join(",")})`,
              }}
            >
              <div className="w-64 h-64 rounded-xl overflow-hidden" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
