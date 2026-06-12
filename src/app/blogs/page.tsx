import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { MotionSection } from "@/components/public/Motion";
import { PublicShell } from "@/components/public/PublicShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/lib/public-data";
import { buildSeo } from "@/lib/seo";

export const metadata = buildSeo({
  title: "Blogs",
  description: "Read healthcare guides on telemedicine, specialists, prevention, and patient preparation.",
  path: "/blogs",
});

export default function BlogsPage() {
  return (
    <PublicShell>
      <main className="bg-slate-50 py-12 dark:bg-slate-950">
        <MotionSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Health blog</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">
            Practical care guides for patients
          </h1>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.slug} className="overflow-hidden dark:border-slate-700 dark:bg-slate-900">
                <img src={post.image} alt="" className="h-48 w-full object-cover" />
                <CardContent className="p-5">
                  <Badge variant="secondary">{post.category}</Badge>
                  <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{post.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                    {post.publishedAt} · {post.readTime}
                  </div>
                  <Button asChild variant="outline" className="mt-5 w-full">
                    <Link href={`/blogs/${post.slug}`}>
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </MotionSection>
      </main>
    </PublicShell>
  );
}
