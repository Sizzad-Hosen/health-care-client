import type { Metadata } from "next";
import { siteUrl } from "@/lib/public-data";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function buildSeo({ title, description, path = "/", image }: SeoInput): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title: `${title} | CareFlow`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "CareFlow",
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
