import {useAtomValue} from "jotai";
import {colorSpacesAtom, shadesCssVariablesAtom} from "../../atom";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";
import {useTheme} from "next-themes";
import {use, useEffect, useState} from "react";
import chroma from "chroma-js";

interface CssVariablesProps {}

const CodeHighlighter = ({code, children}: {code: string; children: React.ReactNode}) => {
  const {theme} = useTheme();

  return (
    <div className="bg-black/5 dark:bg-white/10 rounded-lg flex flex-col gap-4 min-h-0 overflow-y-auto">
      <div className="flex items-center gap-4 px-4 pt-4">
        <h3 className="text-sm flex-grow">
          CSS Variables
          <span className="text-xs text-gray-400"> (for use in CSS)</span>
        </h3>
        {children}
      </div>
      <SyntaxHighlighter
        customStyle={{
          background: "transparent",
          padding: "1rem",
          margin: "0px",
          width: "100%",
          fontSize: "12px",
          fontFamily: "Roboto Mono, monospace",
          lineHeight: 1.5,
        }}
        className="[&>code]:!bg-transparent"
        language="scss"
        style={theme === "dark" ? oneDark : oneLight}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const CssVariables = ({}: CssVariablesProps) => {
  const shadesCssVariables = useAtomValue(shadesCssVariablesAtom);
  const colorSpaces = useAtomValue(colorSpacesAtom);
  const [copied, setCopied] = useState(false);

  const formatColor = (color: string, format: "hex" | "hsl" | "rgb") => {
    switch (format) {
      case "hex":
        return chroma(`hsl(${color})`).hex();
      case "rgb":
        return chroma(`hsl(${color})`).rgb();
      default:
        return color;
    }
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (copied) {
      timerId = setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [copied]);

  let formattedVars = Object.entries(shadesCssVariables)
    .map(([key, value]) => `    ${key}: ${formatColor(value, colorSpaces)};`)
    .join("\n");

  let cssString = `@layer base {\n  :root {\n${formattedVars}\n  }\n}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cssString);
      console.log("🚀 ~ file: css-variables.tsx:67 ~ copyToClipboard ~ cssString:", cssString);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <CodeHighlighter code={cssString}>
        {copied && <span className="text-xs text-green-500 font-medium">Copied!</span>}

        <button
          className="flex items-center gap-2 opacity-30 hover:opacity-100"
          onClick={copyToClipboard}
        >
          <div className="ic-[document-copy]" />
        </button>
      </CodeHighlighter>
    </>
  );
};

export default CssVariables;
