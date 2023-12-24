import chroma from "chroma-js";

const formatHSL = (color: string, initial?: boolean): string => {
  let hsl = chroma(color).hsl();
  let h = isNaN(hsl[0]) ? 0 : initial ? hsl[0] : Math.round(hsl[0]);
  let s = isNaN(hsl[1]) ? 0 : initial ? hsl[1] * 100 : Math.round(hsl[1] * 100);
  let l = isNaN(hsl[2]) ? 0 : initial ? hsl[2] * 100 : Math.round(hsl[2] * 100);

  return `${h},${s}%,${l}%`;
};

export default formatHSL;
