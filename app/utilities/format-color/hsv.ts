import chroma from "chroma-js";

const formatHSV = (color: string, initial?: boolean): string => {
  let hsv = chroma(color).hsv();
  let h = isNaN(hsv[0]) ? 0 : initial ? hsv[0] : Math.round(hsv[0]);
  let s = isNaN(hsv[1]) ? 0 : initial ? hsv[1] * 100 : Math.round(hsv[1] * 100);
  let v = isNaN(hsv[2]) ? 0 : initial ? hsv[2] * 100 : Math.round(hsv[2] * 100);

  return `${h},${s}%,${v}%`;
};

export default formatHSV;
