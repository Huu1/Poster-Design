import { calcPosition, calculateAspectRatioFit } from "@/util/math";
import { TwhSize } from "./type";

export const offsetXY = {
  x: 20,
  y: 80,
};

export const initScale = {
  x: 1,
  y: 1,
};
export const initClip = {
  clipX: 0,
  clipY: 0,
};
export const calcScale = (boardSize: TwhSize, stageSize: TwhSize) => {
  if (!stageSize || !boardSize) {
    return initScale;
  }
  const { x, y } = offsetXY;
  const ratio = calculateAspectRatioFit(
    boardSize.width,
    boardSize.height,
    stageSize?.width - x,
    stageSize?.height - y
  );
  const scale = {
    x: ratio,
    y: ratio,
  };
  return scale;
};
export const calcClip = (boardSize: TwhSize, stageSize: TwhSize) => {
  if (!stageSize || !boardSize) {
    return initClip;
  }
  const clip = calcPosition(
    stageSize.width,
    stageSize.height,
    boardSize.width,
    boardSize.height
  );
  return {
    clipX: clip.x,
    clipY: clip.y,
  };
};

export const fitStageSize = (widths: number, heights: number) => {
  const width = widths % 2 !== 0 ? widths - 1 : widths;
  const height = heights - 1;
  return {
    width,
    height,
  };
};
