"use client";

import React, { useState } from "react";
import { Player, Position } from "@/types/types";
import { ProfileTabNav } from "@/components/settings/ProfileTabNav";
import { AccountTab } from "@/components/settings/AccountTab";
import { StatsTab } from "@/components/settings/StatsTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { ContactTab } from "@/components/settings/ContactTab";
import { ProfileSidebar } from "@/components/settings/ProfileSidebar";
import { AnimatePresence } from "framer-motion";
import { User } from "next-auth";

export type ProfileUser = User & {
  role: "player" | "agent";
  phone: string;
  position: Position;
  avatarUrl?: string;
  stats?: Player["stats"];
  attributes?: Player["attributes"];
};

interface Props {
  user: ProfileUser;
}

export type ProfileTab = "Stats" | "Account" | "Security" | "Contact";

export const Profile: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Stats");
  const tabs: ProfileTab[] = ["Stats", "Account", "Security", "Contact"];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <ProfileSidebar user={user} />

        <div className="flex-1 space-y-6">
          <ProfileTabNav
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="bg-mkr-dark border border-white/5 rounded-[2.5rem] p-8 shadow-2xl min-h-125">
            <AnimatePresence mode="wait">
              {activeTab === "Stats" && <StatsTab key="stats" user={user} />}
              {activeTab === "Account" && <AccountTab key="account" />}
              {activeTab === "Security" && <SecurityTab key="security" />}
              {activeTab === "Contact" && <ContactTab key="contact" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
