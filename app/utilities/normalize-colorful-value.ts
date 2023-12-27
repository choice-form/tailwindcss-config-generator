import chroma from "chroma-js";

export function normalizeColorfulValue(color: string) {
  return /^#/.test(color) ? color : chroma(color).hex();
}
