/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Provider } from "react-redux";
import { useRef } from "react";
import { makeStore } from "./store";

export function ReduxProvider({
  children
}:any) {
  const storeRef = useRef<any>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current} >
      {children}
    </Provider>
  );
}
