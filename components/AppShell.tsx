"use client";

import React, { useState } from "react";
import AppSideBar from "@/components/AppSideBar";
import AppNavBar from "@/components/AppNavBar";
import { ActionFab } from "./ActionFab";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden">
      <div className="relative z-20 shrink-0">
        <AppSideBar collapsed={collapsed} />
      </div>
      <div className="relative grow flex flex-col overflow-hidden">
        <AppNavBar toggleMenu={() => setCollapsed((prev) => !prev)} />
        <main
          className="min-h-screen text-white overflow-auto relative z-10 flex-1 pb-6 md:pb-12"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, #0e1a2b 0%, #080c12 60%, #050709 100%)",
          }}
        >
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          {children}
        </main>
      </div>

      <ActionFab />
    </div>
  );
}
