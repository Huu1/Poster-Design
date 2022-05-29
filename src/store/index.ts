import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./feature/stage";

export default configureStore({
  reducer: {
    stage: boardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
