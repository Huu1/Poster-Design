import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useSize } from "ahooks";
import { calcPosition, calculateAspectRatioFit } from "@/util/math";
import { Tclip, TScale, TwhSize } from "./type";
import { ScaleTool } from "@/components/ScaleTool";
import { StageConfig } from "konva/lib/Stage";
import Konva from "konva";
import { useMutationObserver, useWindowResize } from "./hook";

export const offsetXY = {
  x: 20,
  y: 80,
};

const initScale = {
  x: 1,
  y: 1,
};
const initClip = {
  clipX: 0,
  clipY: 0,
};
const calcScale = (boardSize: TwhSize, stageSize: TwhSize) => {
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
const calcClip = (boardSize: TwhSize, stageSize: TwhSize) => {
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

const StageWrap = ({
  children,
  childrenTool,
}: {
  children: React.ReactNode;
  childrenTool: React.ReactNode;
}) => {
  return (
    <div
      style={{ flex: "1" }}
      className=" flex flex-col w-full h-full  relative"
    >
      <div className="bg-secondary relative  w-full h-full flex-1">
        {children}
      </div>
      {childrenTool}
    </div>
  );
};

const Dashboard = () => {
  // 舞台wrap尺寸
  const stagewrapRef = useRef(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const stagewrapSize = useSize(stagewrapRef) as TwhSize;

  const [isXScroll, setIsXScroll] = useState(false);

  // 舞台尺寸
  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });
  // 舞台比例
  // const [stageScale, setStageScale] = useState<TScale>(initScale);

  // 画板比例
  const [scale, setScale] = useState<TScale>(initScale);

  // 画板尺寸
  const [boardSize, setBoardSize] = useState<TwhSize>({
    width: 500,
    height: 500,
  });

  // 画板位置
  const [boardClip, setBoardClip] = useState<Tclip>(initClip);

  const onBoardScaleChange = useCallback(
    (stageSize: TwhSize) => {
      // 初始化画板在舞台尺寸的比例;
      const scale = calcScale(boardSize, stageSize);
      // 初始化画板的位置
      const scaleBoardSize = {
        width: boardSize.width * scale.x,
        height: boardSize.height * scale.y,
      };
      const clip = calcClip(scaleBoardSize, stageSize) as Tclip;
      setStageSize(stageSize);
      setScale(scale);
      setBoardClip(clip);
    },
    [boardSize]
  );

  // 获取stage父盒子尺寸
  const getStageWrapDomSize = () => {
    if (stagewrapRef.current) {
      const { clientWidth: stageWidth, clientHeight: stageheight } =
        stagewrapRef.current as HTMLElement;

      return {
        width: stageWidth,
        height: stageheight,
      };
    }
    return {
      width: 0,
      height: 0,
    };
  };

  // 初始化舞台和画板尺寸
  useEffect(() => {
    if (stagewrapRef.current) {
      onBoardScaleChange(getStageWrapDomSize());
    }
  }, [onBoardScaleChange]);

  // 侧边栏toggle
  useMutationObserver(() => {
    // 获取正确的大小
    setIsXScroll(false);
    onBoardScaleChange(getStageWrapDomSize());
  });

  // 窗口大小改变
  useWindowResize(() => {
    // // 获取正确的大小
    setIsXScroll(false);
    onBoardScaleChange(getStageWrapDomSize());
  });

  const onScaleChange = (v: any, isResize: boolean) => {
    if (isResize) {
      // 恢复默认比例
      return;
    }

    // 默认舞台大小
    const { width: defaultW, height: defaultH } = stagewrapSize;

    // 画板变化后的比例
    const newBScale = scale.x + v;

    // 画板变化后的宽高
    const newBW = boardSize.width * newBScale;
    const newBH = boardSize.height * newBScale;

    // 设置比例后的舞台大小
    const newStageSize = { ...stageSize };

    if (newBW < defaultW && newBH < defaultH) {
      // 宽高都小于舞台尺寸，舞台大小不变  按照比例调整board
      if (
        newStageSize.width + offsetXY.x > defaultW ||
        newStageSize.height + offsetXY.y > defaultH
      ) {
        onBoardScaleChange(stagewrapSize);
        setIsXScroll(false);
      }
      const clip = calcClip(
        {
          width: newBW,
          height: newBH,
        },
        stagewrapSize
      );
      setScale({
        x: newBScale,
        y: newBScale,
      });

      setBoardClip(clip);
    } else {
      // 宽高有一个大于舞台尺寸，改变舞台尺寸
      newStageSize.width = Math.max(newBW + offsetXY.x, defaultW);
      newStageSize.height = Math.max(defaultH, newBH + offsetXY.y);
      if (newStageSize.width + offsetXY.x > defaultW) {
        // 宽度大于舞台默认时 需要增加滚动条
        setIsXScroll(true);
      }
      onBoardScaleChange(newStageSize);
    }
  };

  return (
    <StageWrap
      childrenTool={<ScaleTool value={scale.x} onChange={onScaleChange} />}
    >
      <div
        ref={stagewrapRef}
        id="stage-wrap"
        className={`absolute  top-0  left-0  w-full h-full  overflow-y-auto ${
          isXScroll ? "overflow-x-auto" : "overflow-x-hidden"
        }`}
      >
        <Stage
          ref={stageRef}
          width={stageSize?.width}
          height={stageSize?.height}
          className="stage-class"
        >
          <Layer
            // ref={layerRef as React.LegacyRef<Konva.Layer>}
            clipHeight={boardSize.height * scale.y}
            clipWidth={boardSize.width * scale.x}
            clipY={boardClip.clipY}
            clipX={boardClip.clipX}
          >
            <Rect
              // ref={boardRef as React.LegacyRef<Konva.Rect>}
              x={boardClip.clipX}
              y={boardClip.clipY}
              width={boardSize.width}
              height={boardSize.height}
              fill={"white"}
              strokeWidth={8} // border width: ;
              stroke="#E0E2E6" // border color
              name="background"
              scale={{
                x: scale.x,
                y: scale.y,
              }}
            />
          </Layer>
        </Stage>
      </div>
    </StageWrap>
  );
};

export default Dashboard;
