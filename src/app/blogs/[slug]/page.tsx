import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { Badge } from "@/components/ui/badge";
import { blogPosts, getBlogPost } from "@/lib/public-data";
import { buildSeo } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return buildSeo({
      title: "Blog",
      description: "Healthcare blog article.",
      path: "/blogs",
    });
  }

  return buildSeo({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${post.slug}`,
    image: post.image,
  });
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PublicShell>
      <main className="bg-white py-12 dark:bg-slate-950">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary">{post.category}</Badge>
          <h1 className="mt-5 text-4xl font-semibold text-slate-950 dark:text-white">{post.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{post.author}</span>
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {post.publishedAt}
            </span>
            <span>{post.readTime}</span>
          </div>
          <img src={post.image} alt="" className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />
          <div className="mt-8 space-y-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
    </PublicShell>
  );
}
