"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { MKRSportsLogo } from "./MKRSportsLogo";
import { cn } from "@/lib/utils";

interface NavBadgeProps {
  count?: number;
}

function NavBadge({ count }: NavBadgeProps) {
  if (!count) return null;
  return (
    <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-mkr-yellow text-mkr-dark text-[10px] font-bold px-1">
      {count > 99 ? "99+" : count}
    </span>
  );
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  href?: string;
  children?: { key: string; label: string; icon: React.ReactNode; href: string }[];
}

export default function AppSideBar({
  collapsed = false,
  className = "",
}: Readonly<{
  className?: string;
  collapsed: boolean;
}>) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>(["users"]);

  const navItems: NavItem[] = [
    {
      key: "/app/dashboard",
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
      label: "Dashboard",
      href: "/app/dashboard",
    },
    {
      key: "/app/fixtures",
      icon: <CalendarDays className="h-4 w-4 shrink-0" />,
      label: "Fixtures",
      href: "/app/fixtures",
    },
    {
      key: "/app/squad",
      icon: <Users className="h-4 w-4 shrink-0" />,
      label: "Squad",
      href: "/app/squad",
    },
    {
      key: "/app/events",
      icon: <CalendarCheck className="h-4 w-4 shrink-0" />,
      label: "Events",
      href: "/app/events",
    },
  ];

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((c) => pathname === c.href);

  return (
    <div
      className={cn(
        "h-screen shrink-0 z-10 flex relative flex-col",
        !collapsed ? "w-50" : "w-20",
        className
      )}
    >
      <div
        className={cn(
          "fixed h-full bg-mkr-navy border-e border-white/10 flex flex-col",
          !collapsed ? "w-50" : "w-20"
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center px-4 font-bold border-b border-white/10 h-15"
          )}
        >
          <MKRSportsLogo collapsed={collapsed} />
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const hasChildren = !!item.children?.length;
            const isOpen = openGroups.includes(item.key);
            const groupActive = isGroupActive(item);

            if (hasChildren) {
              return (
                <div key={item.key}>
                  <button
                    onClick={() => !collapsed && toggleGroup(item.key)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      collapsed ? "justify-center" : "gap-3",
                      groupActive
                        ? "text-mkr-yellow bg-white/5"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className={cn(groupActive && "text-mkr-yellow")}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        <NavBadge count={item.badge} />
                        {isOpen ? (
                          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
                        ) : (
                          <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                        )}
                      </>
                    )}
                  </button>

                  {/* Children */}
                  {!collapsed && isOpen && (
                    <div className="mt-0.5 ml-3 pl-3 border-l border-white/10 space-y-0.5">
                      {item.children!.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                            isActive(child.href)
                              ? "text-mkr-yellow bg-mkr-yellow/10 font-medium"
                              : "text-white/50 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {child.icon}
                          <span className="truncate">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href!}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  collapsed ? "justify-center" : "gap-3",
                  isActive(item.href!)
                    ? "text-mkr-yellow bg-mkr-yellow/10 font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <span className={cn(isActive(item.href!) && "text-mkr-yellow")}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    <NavBadge count={item.badge} />
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}