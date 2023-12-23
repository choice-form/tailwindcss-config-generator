import {useAtomValue} from "jotai";
import {shadesCssVariablesAtom} from "../../atom";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";
import {useTheme} from "next-themes";

interface CssVariablesProps {}

const CodeHighlighter = ({code}: {code: string}) => {
  const {theme} = useTheme();

  return (
    <div className="bg-black/5 dark:bg-white/10 rounded-lg flex flex-col gap-4 min-h-0 overflow-y-auto flex-grow">
      <h3 className="text-sm px-4 pt-4">
        CSS Variables
        <span className="text-xs text-gray-400"> (for use in CSS)</span>
      </h3>
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
  let formattedVars = Object.entries(shadesCssVariables)
    .map(([key, value]) => `    ${key}: ${value.replace(/\s*,\s*\n\s*/g, ", ")};`)
    .join("\n");

  let cssString = `@layer base {\n  :root {\n${formattedVars}\n  }\n}`;

  return <CodeHighlighter code={cssString} />;
};

export default CssVariables;
