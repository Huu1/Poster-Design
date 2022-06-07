import { Tclip, TScale, TwhSize } from "@/views/Dashboard/type";
import {
  initClip,
  initScale,
  innerWtihOuterBoxRatio,
} from "@/views/Dashboard/utils";
import Event, { EventEmitter } from "events";
import Konva from "konva";
import React, { createContext, useReducer } from "react";
import { resizeElements } from "./util";

export type shapeType = Array<Konva.ImageConfig | Konva.TextConfig>;

interface IState {
  /**
   * 事件总线
   */
  eventBus: EventEmitter;

  /**
   * 画版尺寸
   */
  boardSize: TwhSize;
  oldBoardSize: TwhSize;

  /**
   * 画板元素
   */
  shapeElements: shapeType;

  /**
   * 画板比例
   */
  scale: TScale;

  /**
   * 画板比例
   */
  boardClip: Tclip;

  /**
   * 选中的元素
   */
  selectedId: string | undefined;
}

const initialState: IState = {
  boardSize: {
    width: 1920,
    height: 1080,
  },
  oldBoardSize: {
    width: 1920,
    height: 1080,
  },
  eventBus: new Event(),
  shapeElements: [],
  scale: initScale,
  boardClip: initClip,
  selectedId: undefined,
};

export enum Atype {
  boardSize = "boardSize",
  shapeElements = "shapeElements",
  scale = "scale",
  eventBus = "eventBus",
  boardClip = "boardClip",
  resizeShapeElements = "resizeShapeElements",
  oldBoardSize = "oldBoardSize",
  selectedId = "selectedId",
}

type ACTIONTYPE =
  | { type: Atype.boardSize; payload: TwhSize }
  | { type: Atype.shapeElements; payload: shapeType }
  | { type: Atype.scale; payload: TScale }
  | { type: Atype.boardClip; payload: Tclip }
  | { type: Atype.eventBus; payload: EventEmitter }
  | { type: Atype.selectedId; payload: string | undefined }
  | {
      type: Atype.resizeShapeElements;
      payload: {
        newBoardClip: Tclip;
        newBScale: number;
      };
    };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case Atype.boardSize:
      return {
        ...state,
        [Atype.oldBoardSize]: state.boardSize,
        [action.type]: action.payload,
      };
    case Atype.scale:
    case Atype.selectedId:
    case Atype.shapeElements:
    case Atype.boardClip:
      return { ...state, [action.type]: action.payload };

    case Atype.resizeShapeElements:
      return {
        ...state,
        [Atype.shapeElements]: resizeElements(
          state.shapeElements,
          state.scale,
          state.boardClip,
          state.boardSize,
          action.payload.newBoardClip,
          action.payload.newBScale,
          state.oldBoardSize
        ),
        [Atype.oldBoardSize]: state.boardSize,
      };
    default:
      throw new Error("未知的type");
  }
}

export const AppCtx = createContext<{
  state: IState;
  dispatch: React.Dispatch<ACTIONTYPE>;
} | null>(null);

export const AppContext = (props: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppCtx.Provider value={{ state, dispatch }}>
      {props.children}
    </AppCtx.Provider>
  );
};
