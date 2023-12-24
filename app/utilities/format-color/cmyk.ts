import chroma from "chroma-js";

const formatCMYK = (color: string, initial?: boolean): string => {
  let cmyk = chroma(color).cmyk();
  let c = isNaN(cmyk[0]) ? 0 : initial ? cmyk[0] : Math.round(cmyk[0]);
  let m = isNaN(cmyk[1]) ? 0 : initial ? cmyk[1] : Math.round(cmyk[1]);
  let y = isNaN(cmyk[2]) ? 0 : initial ? cmyk[2] : Math.round(cmyk[2]);
  let k = isNaN(cmyk[3]) ? 0 : initial ? cmyk[3] : Math.round(cmyk[3]);

  return `${c},${m},${y},${k}`;
};

export default formatCMYK;
