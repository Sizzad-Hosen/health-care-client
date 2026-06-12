"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function DarkModeToggle() {
  useEffect(() => {
    const stored = window.localStorage.getItem("careflow-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("careflow-theme", next ? "dark" : "light");
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Toggle dark mode"
      onClick={toggle}
    >
      <Moon className="h-4 w-4 dark:hidden" />
      <Sun className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}
