import chroma from "chroma-js";
import {APCAcontrast} from "apca-w3";

const contrastAPCA = (foregroundColor: string, backgroundColor: string) => {
  // 使用chroma获取颜色的亮度值
  const fgYs = chroma(foregroundColor).luminance();
  const bgYs = chroma(backgroundColor).luminance();

  // 使用APCAcontrast计算对比度
  let contrast = APCAcontrast(fgYs, bgYs);

  // 使用toFixed将结果转化为字符串，并保留一位小数
  if (typeof contrast === "number") {
    contrast = contrast.toFixed(1);
  }

  return contrast;
};

export default contrastAPCA;
