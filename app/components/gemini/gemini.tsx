import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";
import {Button, Input} from "@nextui-org/react";
import {reject} from "lodash";
import {useState} from "react";

interface GeminiProps {}

export const Gemini = ({}: GeminiProps) => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  const [data, setData] = useState<string | undefined>();

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

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
        {text: "Generate the color palette from the input description."},
        {text: "input: 秋天的河边"},
        {text: "output: ['#606C38','#283618','#FEFAE0','#DDA15E','#BC6C25']"},
        {text: "input: 可爱的小猪佩奇"},
        {text: "output: ['#CDB4DB','#FFC8DD','#FFAFCC','#BDE0FE','#A2D2FF']"},
        {text: "input: 古巴风情"},
        {text: "output: ['#8ECAE6','#219EBC','#023047','#FFB703','#FB8500']"},
        {text: "input: 古典油画"},
        {text: "output:  ['#C08243','#7E5119','#5C3712','#3D230D','#271609'] "},
        {text: "input: Shanghai Night"},
        {text: "output: ['#000C40','#000080','#4B0082','#8B00FF','#5F9EA0']"},
        {text: "input: Tokyo Night"},
        {text: "output: ['#282C34','#4F5D75','#FDF2F7','#FF8A80','#FFD166']"},
        {
          text: `input: ${inputText}, example: ['#hex', '#hex', '#hex',...], min 3 colors, max 8 colors.`,
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
        `${inputText}, Analyze the image color and generate the color palette. example: ['#hex', '#hex', '#hex',...], min 3 colors, max 8 colors.`,
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

  const hexColors: string[] = data?.match(/#([0-9a-fA-F]{6})/g) || [];
  const colorArray: string[] = hexColors.map((color) => `${color}`);

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

      <div className="w-full">Response: {data}</div>

      {colorArray?.map((color) => (
        <div
          key={color}
          style={
            {
              "--color": color,
              width: 100,
              height: 100,
              backgroundColor: color,
              display: "inline-block",
              margin: 10,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
