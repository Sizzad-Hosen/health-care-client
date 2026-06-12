export default function Loading() {
  return (
    <main className="min-h-screen bg-white p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    </main>
  );
}
