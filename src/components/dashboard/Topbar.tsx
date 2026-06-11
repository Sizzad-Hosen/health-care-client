"use client";

import Link from "next/link";
import { ChevronDown, KeyRound } from "lucide-react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { roleLabels } from "@/lib/auth";
import { RootState } from "@/redux/store";

export function Topbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Healthcare dashboard</p>
          <h1 className="text-lg font-semibold text-slate-950">
            Welcome back, {user?.name ?? "User"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {user ? <Badge>{roleLabels[user.role]}</Badge> : null}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1.5 text-left outline-none hover:bg-slate-50">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex-col items-start gap-0">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-slate-500">{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/change-password" className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Change password
                </Link>
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem asChild>
                <div>
                  <LogoutButton />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden sm:block">
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
