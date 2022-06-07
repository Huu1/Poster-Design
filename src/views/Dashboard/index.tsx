import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { useSize } from "ahooks";
import { EventType, Tclip, TOffset, TScale, TwhSize } from "./type";
import { ScaleTool } from "@/components/ScaleTool";
import Konva from "konva";
import { useMutationObserver, usePrevious, useWindowResize } from "@/hooks";
import {
  calcClip,
  calcScale,
  initClip,
  initScale,
  innerWtihOuterBoxRatio,
  offsetXY,
} from "./utils";
import { useDispatch, useSelector } from "react-redux";
import {
  getStageState,
  resetElements,
  setBoardScale,
  setElements,
} from "@/store/feature/stage";
import Photo from "@/components/Photo";
import { ImageConfig } from "konva/lib/shapes/Image";
import { v4 } from "uuid";
import { resizePos } from "@/util";
import { AppCtx, Atype } from "@/reducer";

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
  const { state, dispatch } = useContext(AppCtx)!;
  // 画板尺寸
  const { boardSize, eventBus, shapeElements, scale, boardClip, selectedId } =
    state;
  // const { boardSize, eventBus, shapeElements, scale } =
  //   useSelector(getStageState);
  // const dispatch = useDispatch();

  // 舞台wrap尺寸
  const stagewrapRef = useRef(null);
  const stagewrapSize = useSize(stagewrapRef) as TwhSize;

  // 舞台实例
  const stageRef = useRef<Konva.Stage | null>(null);

  // 改变舞台尺寸时 是否显示滚动条
  const [isXScroll, setIsXScroll] = useState(false);
  const [isYScroll, setIsYScroll] = useState(false);

  // 舞台尺寸
  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });

  const trRef = useRef<Konva.Transformer>();
  const boardRef = useRef<Konva.Rect>();

  // // 画板位置
  // const [boardClip, setBoardClip] = useState<Tclip>(initClip);

  /**
   * stageSize 根据舞台尺寸设置 画板在舞台的比例
   * 画板尺寸在理想状态下，根据宽高比，最大范围显示在舞台中央
   */
  const onBoardScaleChange = useCallback(
    (stageSize: TwhSize) => {
      console.log("change boardscale", stageSize);
      // 初始化画板在舞台尺寸的比例;
      const scale = calcScale(boardSize, stageSize);
      // 初始化画板的位置
      const scaleBoardSize = {
        width: boardSize.width * scale.x,
        height: boardSize.height * scale.y,
      };
      const clip = calcClip(scaleBoardSize, stageSize) as Tclip;

      dispatch({
        type: Atype.resizeShapeElements,
        payload: {
          newBoardClip: clip,
          newBScale: scale.x,
        },
      });

      dispatch({
        type: Atype.boardClip,
        payload: clip,
      });
      dispatch({
        type: Atype.scale,
        payload: scale,
      });

      setStageSize(stageSize);
    },
    [boardSize]
  );

  // 触发onBoardScaleChange 重新计算比例
  const resizeBoardSize = useCallback(() => {
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
    // 隐藏滚东条，获取正确的大小。
    setIsXScroll(false);
    setIsYScroll(false);
    onBoardScaleChange(getStageWrapDomSize());
  }, [onBoardScaleChange]);

  // 浏览器窗口大小改变
  useWindowResize(resizeBoardSize);

  // 侧边栏toggle切换
  useMutationObserver(resizeBoardSize);

  useEffect(() => {
    const photoHandle = () => {
      console.log(123);
    };
    eventBus.on(EventType.photo, photoHandle);

    return () => {
      eventBus.off(EventType.photo, photoHandle);
    };
  }, [eventBus]);

  // 根据画板比例改变 重新设置舞台尺寸
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
        setStageSize(newStageSize);
        setIsXScroll(false);
        setIsYScroll(false);
      }

      // 计算clip
      const clip = calcClip(
        {
          width: newBW,
          height: newBH,
        },
        stagewrapSize
      );
      // 重新设置元素位置 相对画板
      dispatch({
        type: Atype.resizeShapeElements,
        payload: {
          newBoardClip: clip,
          newBScale: newBScale,
        },
      });
      // 画板位置
      dispatch({
        type: Atype.boardClip,
        payload: clip,
      });
      // 设置画板的新比例
      dispatch({
        type: Atype.scale,
        payload: {
          x: newBScale,
          y: newBScale,
        },
      });
    } else {
      // 宽高有一个大于舞台尺寸，改变舞台尺寸
      newStageSize.width = Math.max(newBW + offsetXY.x, defaultW);
      newStageSize.height = Math.max(defaultH, newBH + offsetXY.y);
      if (newStageSize.width + offsetXY.x > defaultW) {
        // 宽度大于舞台默认时 需要增加滚动条
        setIsXScroll(true);
      }
      if (newStageSize.height + offsetXY.y > defaultH) {
        // 宽度大于舞台默认时 需要增加滚动条
        setIsYScroll(true);
      }
      onBoardScaleChange(newStageSize);
    }
  };

  // useEffect(() => {}, [boardClip, scale, boardSize]);

  const onDropHandle = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // register event position
    stageRef.current?.setPointersPositions(e);
    const { height, url, width } = JSON.parse(
      e.dataTransfer?.getData("text/plain")
    );

    const pos = stageRef.current?.getPointerPosition() as TScale;

    const shapeEle = shapeElements.concat([
      {
        ...pos,
        src: url,
        type: "image",
        draggable: true,
        height,
        width,
        id: v4(),
      },
    ]);

    dispatch({
      type: Atype.shapeElements,
      payload: shapeEle,
    });
  };

  const renderElement = () => {
    return shapeElements.map((item, index: number) => {
      if (item.type === "image") {
        return (
          <Photo
            onChange={(photo) => {
              // const rects = shapeElements.slice();
              // rects[index] = photo;
              // dispatch(setElements(rects));
            }}
            onSelect={(shapeRef) => {
              dispatch({
                type: Atype.selectedId,
                payload: item.id,
              });
              if (shapeRef) {
                trRef.current?.nodes([shapeRef]);
                trRef.current?.getLayer()?.batchDraw();
              }
            }}
            key={item.id}
            shapeProps={item as ImageConfig}
            scale={scale}
            isSelected={item.id === selectedId}
          />
        );
      }
      return <></>;
    });
  };

  const checkDeselect = (e: { target: { getStage: () => any } }) => {
    // deselect when clicked on empty area
    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target === boardRef.current;
    if (clickedOnEmpty) {
      dispatch({
        type: Atype.selectedId,
        payload: undefined,
      });
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
          isYScroll ? "overflow-y-auto" : "overflow-y-hidden"
        } ${isXScroll ? "overflow-x-auto" : "overflow-x-hidden"}`}
      >
        {/* 舞台 */}
        <div
          className="relavite"
          onDrop={onDropHandle}
          onDragOver={(e) => e.preventDefault()}
        >
          <Stage
            ref={stageRef}
            width={stageSize?.width}
            height={stageSize?.height}
            className="stage-class"
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
          >
            <Layer
              // ref={layerRef as React.LegacyRef<Konva.Layer>}
              clipHeight={boardSize.height * scale.y}
              clipWidth={boardSize.width * scale.x}
              clipY={boardClip.clipY}
              clipX={boardClip.clipX}
            >
              {/* 画板 */}
              <Rect
                ref={boardRef as React.LegacyRef<Konva.Rect>}
                x={boardClip.clipX}
                y={boardClip.clipY}
                width={boardSize.width}
                height={boardSize.height}
                fill={"white"}
                strokeWidth={2} // border width: ;
                stroke="#E0E2E6" // border color
                name="background"
                scale={scale}
              />
              {renderElement()}
              {selectedId && (
                <Transformer
                  ref={trRef as React.LegacyRef<Konva.Transformer>}
                  boundBoxFunc={(oldBox, newBox) => {
                    // limit resize
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </StageWrap>
  );
};

export default Dashboard;
