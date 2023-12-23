import {useTheme} from "next-themes";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";
import {formatCode} from "../../utilities";
import {useAtomValue} from "jotai";
import {shadesConfigAtom} from "../../atom";

interface ConfigProps {}

const CodeHighlighter = ({code}: {code: string}) => {
  const {theme} = useTheme();

  return (
    <div className="bg-black/5 dark:bg-white/10 rounded-lg flex flex-col gap-4 min-h-0 flex-grow overflow-y-auto">
      <h3 className="text-sm px-4 pt-4">
        Config
        <span className="text-xs text-gray-400"> (for use in tailwind.config.js)</span>
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
        language="json"
        style={theme === "dark" ? oneDark : oneLight}
      >
        {formatCode(code)}
      </SyntaxHighlighter>
    </div>
  );
};

const Config = ({}: ConfigProps) => {
  const shadesConfig = useAtomValue(shadesConfigAtom);
  let jsonString = JSON.stringify(shadesConfig).replace(/"(\w+)"\s*:/g, "$1:");

  return <CodeHighlighter code={jsonString} />;
};

export default Config;
