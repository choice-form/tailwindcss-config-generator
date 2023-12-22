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

export default formatCode;
