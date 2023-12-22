import {useAtomValue} from "jotai";
import {shadesCssVarsAtom} from "../../atom";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";
import {useTheme} from "next-themes";
import {formatCode} from "../../utilities";

interface CssVarProps {}

const CodeHighlighter = ({code}: {code: string}) => {
  const {theme} = useTheme();

  return (
    <div className="bg-black/5 dark:bg-white/10 rounded-lg flex flex-col gap-4">
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

const CssVar = ({}: CssVarProps) => {
  const shadesCssVars = useAtomValue(shadesCssVarsAtom);
  let jsonString = JSON.stringify(shadesCssVars).replace(/"(\w+)"\s*:/g, "$1:");

  return <CodeHighlighter code={jsonString} />;
};

export default CssVar;
