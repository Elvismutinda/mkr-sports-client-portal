"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Menu, Bell, LogOut, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

interface AppNavBarProps {
  toggleMenu: () => void;
}

export default function AppNavBar({ toggleMenu }: AppNavBarProps) {
  const user = useCurrentUser();
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const notificationCount = 0;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="h-15 shrink-0 z-10 border-b border-white/10 flex flex-row items-center px-4 bg-mkr-navy backdrop-blur-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="text-white hover:bg-white/10"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex grow items-center justify-end gap-4">
        {process.env.NEXT_PUBLIC_ENVIRONMENT && (
          <Badge className="bg-mkr-yellow/20 text-mkr-yellow border-mkr-yellow/30 hover:bg-mkr-yellow/20">
            {process.env.NEXT_PUBLIC_ENVIRONMENT}
          </Badge>
        )}

        <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="relative cursor-pointer">
              <Bell className="h-5 w-5 text-gray-400 hover:text-mkr-yellow transition-colors" />
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-mkr-yellow text-mkr-dark text-[10px] font-bold px-1">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 bg-mkr-navy border-white/10 text-white"
          >
            <p className="text-sm text-gray-400 text-center py-4">
              No new notifications
            </p>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-black text-white uppercase tracking-tight leading-none mb-0.5">
              {user?.name ?? "—"}
            </p>
            <p className="text-[10px] font-black text-mkr-yellow uppercase tracking-widest leading-none">
              {user?.position ?? "Player"}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white/20 hover:ring-mkr-yellow transition-all duration-200">
                  <AvatarFallback className="bg-mkr-dark text-mkr-yellow font-black text-sm uppercase">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-mkr-navy border-white/10 text-white"
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/80 focus:bg-white/80"
                >
                  <Users className="h-4 w-4 text-gray-400" />
                  Public portal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
