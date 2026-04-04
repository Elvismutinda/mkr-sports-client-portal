"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, BarChart3, Shield, Mail } from "lucide-react";
import { ProfileTab } from "@/components/settings/Profile";

interface Props {
  tabs: ProfileTab[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const TAB_ICONS: Record<ProfileTab, React.ReactNode> = {
  Stats: <BarChart3 size={12} />,
  Account: <User size={12} />,
  Security: <Shield size={12} />,
  Contact: <Mail size={12} />,
};

export const ProfileTabNav: React.FC<Props> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-mkr-dark/50 p-1.5 rounded-2xl border border-white/5 flex gap-1 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 min-w-25 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
            activeTab === tab
              ? "text-mkr-navy"
              : "text-slate-500 hover:text-white hover:bg-white/5"
          }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-mkr-yellow rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {TAB_ICONS[tab]}
            {tab}
          </span>
        </button>
      ))}
    </div>
  );
};
