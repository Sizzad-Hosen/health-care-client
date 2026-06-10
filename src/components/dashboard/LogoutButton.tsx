"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logout } from "@/redux/features/auth/authSlice";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { AppDispatch } from "@/redux/store";

export function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser().unwrap().catch(() => undefined);
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
