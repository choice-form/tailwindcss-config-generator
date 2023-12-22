import chroma from "chroma-js";

function readableColor(color: chroma.Color) {
  return chroma(color).luminance() < 0.5 ? chroma("white") : chroma("black");
}
export default readableColor;
