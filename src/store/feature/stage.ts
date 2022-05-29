import { TwhSize } from "@/views/Dashboard/type";
import { createSlice } from "@reduxjs/toolkit";
import Event, { EventEmitter } from "events";
interface IState {
  // 画板尺寸
  boardSize: TwhSize;
  eventBus: EventEmitter;
}

const initialState: IState = {
  boardSize: {
    width: 1920,
    height: 1080,
  },
  eventBus: new Event(),
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setBoardSize(state, action) {
      state.boardSize = action.payload;
    },
  },
});

export const { setBoardSize } = stageSlice.actions;

export default stageSlice.reducer;

// 获取画板尺寸
export const getStageState = (state: any): IState => state.stage;
