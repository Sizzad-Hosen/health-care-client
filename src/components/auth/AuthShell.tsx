import { Activity, ShieldCheck } from "lucide-react";

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-950">CareFlow</p>
              <p className="text-sm text-slate-500">Healthcare Operations</p>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm text-emerald-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Secure clinic access
            </div>
            <h1 className="text-5xl font-semibold tracking-normal text-slate-950">
              Appointment, schedule, and patient access in one calm workspace.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A role-aware healthcare dashboard built for admins, doctors, and
              patients with clean auth flows and practical access control.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="rounded-lg border border-white bg-white/70 p-4 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">24/7</p>
              <p>Access control</p>
            </div>
            <div className="rounded-lg border border-white bg-white/70 p-4 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">3</p>
              <p>Role dashboards</p>
            </div>
            <div className="rounded-lg border border-white bg-white/70 p-4 shadow-sm">
              <p className="text-2xl font-semibold text-slate-950">100%</p>
              <p>Demo ready</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">CareFlow</p>
                  <p className="text-sm text-slate-500">Healthcare Operations</p>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-700">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            <div className="mt-6">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
