"use client";

import { useMemo, useState } from "react";
import { Bot, Send } from "lucide-react";
import { aiPrompts } from "@/lib/public-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AiCarePanel() {
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");
  const selected = aiPrompts[active];
  const answer = useMemo(() => {
    if (!message.trim()) {
      return selected.response;
    }

    return `${selected.response} Based on your note, a clinician should confirm details before treatment decisions.`;
  }, [message, selected.response]);

  return (
    <Card className="overflow-hidden border-emerald-200 bg-white shadow-lg shadow-emerald-950/5 dark:border-slate-700 dark:bg-slate-900">
      <CardContent className="p-0">
        <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-950 dark:text-white">AI Care Assistant</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Guidance only, not a medical diagnosis
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 p-4">
          <div className="grid gap-2 sm:grid-cols-3">
            {aiPrompts.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  className={`rounded-md border p-3 text-left text-sm transition ${
                    active === index
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setActive(index)}
                >
                  <Icon className="mb-2 h-4 w-4" />
                  {item.title}
                </button>
              );
            })}
          </div>
          <div className="rounded-md bg-slate-950 p-4 text-white">
            <p className="text-sm text-emerald-300">Example prompt</p>
            <p className="mt-1 text-sm">{selected.prompt}</p>
            <div className="mt-4 rounded-md bg-white/10 p-3 text-sm leading-6 text-slate-100">
              {answer}
            </div>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe symptoms or ask a care question"
              className="dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <Button type="submit" size="icon" aria-label="Ask assistant">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
