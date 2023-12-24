import chroma from "chroma-js";

const formatLCH = (color: string, initial?: boolean): string => {
  let lch = chroma(color).lch();
  let l = isNaN(lch[0]) ? 0 : initial ? lch[0] : Math.round(lch[0]);
  let c = isNaN(lch[1]) ? 0 : initial ? lch[1] : Math.round(lch[1]);
  let h = isNaN(lch[2]) ? 0 : initial ? lch[2] : Math.round(lch[2]);

  return `${l},${c},${h}`;
};

export default formatLCH;
