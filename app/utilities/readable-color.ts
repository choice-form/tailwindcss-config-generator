import chroma from "chroma-js";

function readableColor(color: chroma.Color) {
  return chroma(color).luminance() < 0.5 ? chroma(color).brighten(3.5) : chroma(color).darken(3.5);
}
export default readableColor;
