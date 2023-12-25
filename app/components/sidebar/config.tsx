import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";
import {useStore} from "../../store/provider";
import {formatCode} from "../../utilities";

interface ConfigProps {}

const CodeHighlighter = ({
  code,
  children,
  showCodes,
}: {
  code: string;
  children: React.ReactNode;
  showCodes?: boolean;
}) => {
  const {theme} = useTheme();

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto rounded-lg bg-black/5 dark:bg-white/10">
      <div className="flex items-center gap-4 p-4">
        <h3 className="flex-grow text-sm">
          Config
          <span className="text-xs text-gray-400"> (for use in tailwind.config.js) (colors)</span>
        </h3>
        {children}
      </div>
      {showCodes && (
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
      )}
    </div>
  );
};

const Config = ({}: ConfigProps) => {
  const project = useStore((state) => state.project);
  const shadesConfig = useStore((state) => state.shadesConfig);
  const [copied, setCopied] = useState(false);

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

  let jsonString = JSON.stringify(shadesConfig).replace(/"(\w+)"\s*:/g, "$1:");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const showCodes = project.shades.length > 0;

  return (
    <CodeHighlighter code={jsonString} showCodes={showCodes}>
      {copied && <span className="text-xs font-medium text-green-500">Copied!</span>}
      {showCodes && (
        <button
          className="flex items-center gap-2 opacity-30 hover:opacity-100"
          onClick={copyToClipboard}
        >
          <div className="ic-[document-copy]" />
        </button>
      )}
    </CodeHighlighter>
  );
};

export default Config;
