"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-4 dark:bg-slate-950">
      <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-950 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
        <AlertTriangle className="mx-auto h-8 w-8" />
        <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm opacity-80">The page could not be loaded. Please try again.</p>
        <Button type="button" className="mt-5" onClick={reset}>
          Retry
        </Button>
      </div>
    </main>
  );
}
