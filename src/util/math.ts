// 计算内部矩形在外部矩形内的最大显示比例
export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return ratio;
}

// 计算内部矩形在外部矩形内居中后 xy定位
export const calcPosition = (
  outWidth: number,
  outHeight: number,
  innerWidth: number,
  innerHeight: number
) => {
  const x = (outWidth - innerWidth) / 2;
  const y = (outHeight - innerHeight) / 2;

  return {
    x,
    y,
  };
};
