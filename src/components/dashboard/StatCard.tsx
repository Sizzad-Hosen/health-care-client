import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  helper,
  icon: Icon,
}: {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}
