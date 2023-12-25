"use client";

import {createContext, useContext, useEffect, useState, type PropsWithChildren} from "react";
import {useStoreWithEqualityFn} from "zustand/traditional";
import {derivedState} from "./derived-state";
import {Service, type AppState} from "./service";

type Flatten<T> = T extends object ? {[K in keyof T]: T[K]} : T;

const StoreContext = createContext<Service | null>(null);

export function useService() {
  const service = useContext(StoreContext);

  if (service === null) {
    throw new Error("useStore 必须在 StoreProvider 中使用");
  }

  return service;
}

export function useStore<T>(
  selector: (state: Flatten<AppState & ReturnType<typeof derivedState>>) => T,
  equals: (prev: T, next: T) => boolean = Object.is,
) {
  const service = useService();
  return useStoreWithEqualityFn(service.store, selector, equals);
}

export function StoreProvider({children, state}: PropsWithChildren<{state: AppState}>) {
  const [service] = useState(() => new Service(state, derivedState));

  useEffect(() => {
    return service.store.subscribe((state) => {
      console.info("state", state);
    });
  }, [state]);

  return <StoreContext.Provider value={service}>{children}</StoreContext.Provider>;
}
