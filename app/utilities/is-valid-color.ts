import chroma from "chroma-js";

function isValidColor(color: string) {
  if (chroma.valid(color)) {
    return chroma(color).hex();
  }
  return null;
}

export default isValidColor;
