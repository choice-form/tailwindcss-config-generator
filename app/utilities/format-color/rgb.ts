import chroma from "chroma-js";

const formatRGB = (color: string, initial?: boolean): string => {
  let rgb = chroma(color).rgb();
  let r = isNaN(rgb[0]) ? 0 : initial ? rgb[0] : Math.round(rgb[0]);
  let g = isNaN(rgb[1]) ? 0 : initial ? rgb[1] : Math.round(rgb[1]);
  let b = isNaN(rgb[2]) ? 0 : initial ? rgb[2] : Math.round(rgb[2]);

  return `${r},${g},${b}`;
};

export default formatRGB;
