"use client";

import { ReactNode } from "react";
import { AgriculteurProvider } from "../context/AgriculteurContext";
import { LotsProvider } from "../context/LotsContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AgriculteurProvider>
      <LotsProvider>
        {children}
      </LotsProvider>
    </AgriculteurProvider>
  );
}
