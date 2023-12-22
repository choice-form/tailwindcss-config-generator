import chroma from "chroma-js";

/* cSpell:disable */
function determineColorType(color: string) {
  try {
    // Throws an error if the color is invalid
    chroma(color);

    // Check if color is a named color
    if (/^[a-zA-Z]+$/.test(color)) {
      return "name";
    }

    // Check for other color spaces
    if (
      /^[a-fA-F0-9]{3}(?:[a-fA-F0-9]{3})?$/.test(color) ||
      /^#[a-fA-F0-9]{3}(?:[a-fA-F0-9]{3})?$/.test(color)
    )
      return "hex";
    if (/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,(0?\.?\d+|1))?\)$/.test(color)) return "rgb";
    if (/^hsla?\((\d{1,3}),(\d{1,3}%),(\d{1,3}%)(,(0?\.?\d+|1))?\)$/.test(color)) return "hsl";
    if (/^hsva?\((\d{1,3}),(\d{1,3}%),(\d{1,3}%)(,(0?\.?\d+|1))?\)$/.test(color)) return "hsv";
    if (/^cmyk?\((\d{1,3}%),(\d{1,3}%),(\d{1,3}%),(\d{1,3}%)\)$/.test(color)) return "cmyk";
    if (/^lab\((\d{1,3}(\.\d+)?),(\d{1,3}(\.\d+)?),(\d{1,3}(\.\d+)?)\)$/.test(color)) return "lab";
    if (/^lch\((\d{1,3}(\.\d+)?),(\d{1,3}(\.\d+)?),(\d{1,3}(\.\d+)?)\)$/.test(color)) return "lch";
    // Add more checks here for other color spaces

    return "unknown";
  } catch {
    return "unknown";
  }
}

export default determineColorType;
