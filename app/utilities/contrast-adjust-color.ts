import chroma from "chroma-js";

function contrastAdjustColor(color: string) {
  const luminance = chroma(color).luminance();
  if (luminance < 0.3) {
    return chroma(color).brighten(3).hex(); // if too dark, increase to 20% luminance
  } else if (luminance > 0.7) {
    return chroma(color).darken(3).hex(); // too light, decrease to 80% luminance
  } else {
    return color;
  }
}

export default contrastAdjustColor;
