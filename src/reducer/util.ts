import { Tclip, TScale, TwhSize } from "@/views/Dashboard/type";
import { innerWtihOuterBoxRatio } from "@/views/Dashboard/utils";
import { shapeType } from ".";

export const resizeElements = (
  shapeElements: shapeType,
  scale: TScale,
  boardClip: Tclip,
  boardSize: TwhSize,
  newBoardClip: Tclip,
  newBScale: number,
  oldBoardSize: TwhSize
) => {
  return shapeElements.map((item) => {
    const r = innerWtihOuterBoxRatio(
      item.x as number,
      item.y as number,
      boardClip.clipX,
      boardClip.clipY,
      boardSize.width * scale.x,
      boardSize.height * scale.y
    );
    const result = { ...item };
    result.x = newBoardClip.clipX + boardSize.width * newBScale * r.x;
    result.y = newBoardClip.clipY + boardSize.height * newBScale * r.y;

    // if (
    //   oldBoardSize.width !== boardSize.width ||
    //   oldBoardSize.height !== boardSize.height
    // ) {
    //   result.width =
    //     ((result.width as number) * boardSize.width) / oldBoardSize.width;
    //   result.height =
    //     ((result.height as number) * boardSize.height) / oldBoardSize.height;
    // }

    // console.log(result);

    return result;
  });
};
