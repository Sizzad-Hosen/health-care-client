"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Unauthorized access
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your current role does not have permission to open that dashboard.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Go to my dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
