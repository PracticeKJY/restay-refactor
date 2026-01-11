// app/providers.tsx
"use client";

import { Provider, createStore } from "jotai";
import { Toaster } from "react-hot-toast";

const store = createStore();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster />
      {children}
    </Provider>
  );
}
