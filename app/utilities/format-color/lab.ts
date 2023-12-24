import chroma from "chroma-js";

const formatLAB = (color: string, initial?: boolean): string => {
  let lab = chroma(color).lab();
  let l = isNaN(lab[0]) ? 0 : initial ? lab[0] : Math.round(lab[0]);
  let a = isNaN(lab[1]) ? 0 : initial ? lab[1] : Math.round(lab[1]);
  let b = isNaN(lab[2]) ? 0 : initial ? lab[2] : Math.round(lab[2]);

  return `${l},${a},${b}`;
};

export default formatLAB;
