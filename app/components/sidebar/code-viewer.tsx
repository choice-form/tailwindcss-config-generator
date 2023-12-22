import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { SwatchColorMap } from "../../swatch/generateShades";

interface CodeViewerProps {
  shadesObject: SwatchColorMap;
}

function formatCode(code: string) {
  let indentLevel = 0;
  let formattedCode = "";
  let insideQuotes = false;
  for (let char of code) {
    switch (char) {
      case "{":
      case "[":
        formattedCode += char + "\n" + "  ".repeat(++indentLevel);
        break;
      case "}":
      case "]":
        formattedCode += "\n" + "  ".repeat(--indentLevel) + char;
        break;
      case ",":
        formattedCode += insideQuotes ? "," : ",\n" + "  ".repeat(indentLevel);
        break;
      case ":":
        formattedCode += insideQuotes ? ":" : ": ";
        break;
      case '"':
        insideQuotes = !insideQuotes;
        formattedCode += char;
        break;
      default:
        formattedCode += char;
    }
  }
  return formattedCode;
}

const CodeHighlighter = ({ code }: { code: string }) => {
  const { theme } = useTheme();

  return (
    <div className="bg-black/5 dark:bg-white/10 rounded-lg backdrop-blur pointer-events-auto flex flex-col gap-4 overflow-y-auto">
      <h3 className="text-sm px-4 pt-4">Config</h3>
      <SyntaxHighlighter
        customStyle={{
          background: "transparent",
          padding: "1rem",
          margin: "0px",
          width: "100%",
          fontSize: "14px",
          fontFamily: "Roboto Mono, monospace",
          lineHeight: 1.5,
        }}
        className="[&>code]:!bg-transparent"
        language="json"
        style={theme === "dark" ? oneDark : oneLight}
      >
        {formatCode(code)}
      </SyntaxHighlighter>
    </div>
  );
};

const CodeViewer = ({ shadesObject }: CodeViewerProps) => {
  let jsonString = JSON.stringify(shadesObject).replace(/"(\w+)"\s*:/g, "$1:");

  return <CodeHighlighter code={jsonString} />;
};

export default CodeViewer;
