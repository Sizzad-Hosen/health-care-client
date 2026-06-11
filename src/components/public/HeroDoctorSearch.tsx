"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroDoctorSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim()
      ? `?searchTerm=${encodeURIComponent(searchTerm.trim())}`
      : "";

    router.push(`/doctors${query}`);
  };

  return (
    <form
      className="mt-8 flex max-w-2xl flex-col gap-3 rounded-lg bg-white/95 p-2 shadow-xl shadow-slate-950/20 sm:flex-row"
      onSubmit={onSubmit}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="h-12 border-transparent pl-9 shadow-none"
          placeholder="Search doctors by name, specialty, or qualification"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <Button type="submit" className="h-12 px-6">
        Search doctors
      </Button>
    </form>
  );
}
