import { TScale, TwhSize } from "@/views/Dashboard/type";
import { initScale } from "@/views/Dashboard/utils";
import Event, { EventEmitter } from "events";
import Konva from "konva";
import React, { createContext, useReducer } from "react";

type shapeType = Array<Konva.ImageConfig | Konva.TextConfig>;

interface IState {
  /**
   * 画版尺寸
   */
  boardSize: TwhSize;

  /**
   * 事件总线
   */
  eventBus: EventEmitter;

  /**
   * 画板元素
   */
  shapeElements: shapeType;

  /**
   * 画板比例
   */
  scale: TScale;
}

const initialState: IState = {
  boardSize: {
    width: 1920,
    height: 1080,
  },
  eventBus: new Event(),
  shapeElements: [],
  scale: initScale,
};

export enum Atype {
  boardSize = "boardSize",
  shapeElements = "shapeElements",
  boardScale = "boardScale",
  eventBus = "eventBus",
}

type ACTIONTYPE =
  | { type: Atype.boardSize; payload: TwhSize }
  | { type: Atype.shapeElements; payload: shapeType }
  | { type: Atype.boardScale; payload: TScale }
  | { type: Atype.eventBus; payload: EventEmitter };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case Atype.boardSize:
    case Atype.shapeElements:
    case Atype.boardScale:
    case Atype.eventBus:
      return { ...state, [action.type]: action.payload };
    default:
      throw new Error();
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
