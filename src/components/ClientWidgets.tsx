"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const AiPortfolioAssistant = dynamic(() => import("./AiPortfolioAssistant"), { ssr: false });
const TerminalModal = dynamic(() => import("./TerminalModal"), { ssr: false });
const CustomContextMenu = dynamic(() => import("./CustomContextMenu"), { ssr: false });
const VisitorTracker = dynamic(() => import("./VisitorTracker"), { ssr: false });

export default function ClientWidgets() {
  const [loadHeavyWidgets, setLoadHeavyWidgets] = useState(false);

  useEffect(() => {
    // Defer heavy widgets until main thread is idle to eliminate TBT penalty
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const handle = (window as any).requestIdleCallback(
          () => setLoadHeavyWidgets(true),
          { timeout: 3000 }
        );
        return () => (window as any).cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(() => setLoadHeavyWidgets(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <>
      <VisitorTracker />
      {loadHeavyWidgets && (
        <>
          <AiPortfolioAssistant />
          <TerminalModal />
          <CustomContextMenu />
        </>
      )}
    </>
  );
}
