import chroma from "chroma-js";
import {useEffect, useState} from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {useStore} from "../../store/provider";

interface CssVariablesProps {}

const CodeHighlighter = ({
  code,
  children,
  showCodes,
}: {
  code: string;
  children: React.ReactNode;
  showCodes?: boolean;
}) => {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-y-auto">
      <div className="absolute right-0 top-0 z-20 flex h-12 items-center gap-4 px-4">
        {children}
      </div>

      {showCodes && (
        <SyntaxHighlighter
          customStyle={{
            background: "transparent",
            padding: "2rem 1rem",
            margin: "48px 0 0 0",
            width: "100%",
            fontSize: "13px",
            fontFamily: "Roboto Mono, monospace",
            lineHeight: 1.5,
          }}
          className="[&>code]:!bg-transparent"
          language="css"
        >
          {code}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

const CssVariables = ({}: CssVariablesProps) => {
  const project = useStore((state) => state.project);
  const shadesCssVariables = useStore((state) => state.shadesCssVariables);
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
    .map(([key, value]) => `    ${key}: ${formatColor(value, project.colorSpaces)};`)
    .join("\n");

  let cssString = `@layer base {\n  :root {\n${formattedVars}\n  }\n}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cssString);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const showCodes = project.shades.length > 0;

  return (
    <CodeHighlighter code={cssString} showCodes={showCodes}>
      {copied && <span className="text-xs font-medium text-green-500">Copied!</span>}
      {showCodes && (
        <button
          className="flex items-center gap-2 text-sm opacity-30 hover:opacity-100"
          onClick={copyToClipboard}
        >
          <div className="ic-[document-copy] h-3 w-3" />
          Copy code
        </button>
      )}
    </CodeHighlighter>
  );
};

export default CssVariables;