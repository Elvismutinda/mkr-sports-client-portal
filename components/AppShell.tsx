"use client";

import React, { useState } from "react";
import AppSideBar from "@/components/AppSideBar";
import AppNavBar from "@/components/AppNavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden">
      <div className="relative z-20 shrink-0">
        <AppSideBar collapsed={collapsed} />
      </div>
      <div className="relative grow flex flex-col overflow-hidden">
        <AppNavBar toggleMenu={() => setCollapsed((prev) => !prev)} />
        <div className="p-4 bg-mkr-navy/96 grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}