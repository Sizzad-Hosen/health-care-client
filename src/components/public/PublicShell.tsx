import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/specialties", label: "Specialties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
              <Activity className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-slate-950">CareFlow</span>
              <span className="block text-xs text-slate-500">Healthcare access</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-emerald-700">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                Join
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500">
                <Activity className="h-5 w-5" />
              </span>
              <p className="font-semibold">CareFlow</p>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              A patient-first healthcare platform for finding doctors, comparing
              specialties, and moving from search to appointment with confidence.
            </p>
          </div>
          <div>
            <p className="font-semibold">Explore</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link href="/doctors">Doctors</Link>
              <Link href="/specialties">Specialties</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold">Access</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link href="/register">Create account</Link>
              <Link href="/login">Sign in</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
