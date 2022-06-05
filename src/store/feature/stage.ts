import { TScale, TwhSize } from "@/views/Dashboard/type";
import { initScale } from "@/views/Dashboard/utils";
import { createSlice } from "@reduxjs/toolkit";
import Event, { EventEmitter } from "events";
import Konva from "konva";
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
  shapeElements: Array<Konva.ImageConfig | Konva.TextConfig>;

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

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setBoardSize(state, action) {
      state.boardSize = action.payload;
    },
    setElements(state, action) {
      state.shapeElements = action.payload;
    },
    setBoardScale(state, action) {
      state.scale = action.payload;
    },
    resetElements(state, action) {
      console.log(action);
    },
  },
});

export const { setBoardSize, setElements, setBoardScale, resetElements } =
  stageSlice.actions;

export default stageSlice.reducer;

// 获取画板尺寸
export const getStageState = (state: any): IState => state.stage;
