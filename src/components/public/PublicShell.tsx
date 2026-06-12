import Link from "next/link";
import { Activity, ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicNavItems } from "@/lib/public-data";
import { DarkModeToggle } from "./DarkModeToggle";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
              <Activity className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">CareFlow</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Healthcare access</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                Join
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button type="button" variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-slate-950 text-white dark:border-slate-800">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
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
              <Link href="/blogs">Blogs</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold">Care</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link href="/appointment">Book appointment</Link>
              <Link href="/reviews">Reviews</Link>
              <Link href="/contact">Support</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold">Legal</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
