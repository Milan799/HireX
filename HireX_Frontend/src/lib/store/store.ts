import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import jobReducer from "./slices/jobSlice";
import applicationReducer from "./slices/applicationSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      job: jobReducer,
      application: applicationReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
