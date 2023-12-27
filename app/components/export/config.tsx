import {useEffect, useState} from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {useStore} from "../../store/provider";
import {formatCode} from "../../utilities";
import {Button} from "@nextui-org/react";

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
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-y-auto">
      <div className="absolute right-2 top-0 z-20 flex h-12 items-center gap-4">{children}</div>

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
          language="json"
        >
          {formatCode(code)}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

const Config = ({}: ConfigProps) => {
  const shades = useStore((state) => state.project.shades);
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

  const showCodes = shades.length > 0;

  return (
    <CodeHighlighter code={jsonString} showCodes={showCodes}>
      {copied && <span className="text-xs font-medium text-green-500">Copied!</span>}
      {showCodes && (
        <Button
          startContent={<div className="ic-[document-copy] h-3 w-3" />}
          variant="light"
          size="sm"
          onClick={copyToClipboard}
        >
          Copy code
        </Button>
      )}
    </CodeHighlighter>
  );
};

export default Config;
