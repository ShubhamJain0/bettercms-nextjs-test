import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogPostDetailActions } from "@/app/components/blog-post-detail-actions";
import {
  formatPublishedDate,
  getAuthorLabel,
} from "@/app/components/blog-post-utils";
import { bcms } from "@/src/bettercms.bindings.generated";
import { cms } from "@/src/bettercms";
import type { BlogPostFields } from "@/src/bettercms.generated";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await cms.getEntry<BlogPostFields>(slug, {
    revalidate: 60,
    tags: ["blog-post", `blog-post:${slug}`],
    depth: 1,
  });

  if (!post) {
    notFound();
  }

  const { fields } = post;
  const author = getAuthorLabel(fields);
  const publishedDate = formatPublishedDate(fields.published ?? post.publishedAt);
  const thumbnailUrl = fields.thumbnail?.url;
  const thumbnailAlt =
    fields.thumbnail?.altText ?? fields.name ?? "Post thumbnail";

  return (
    <main className="flex-1">
      <article>
        <header className="relative min-h-[58vh] overflow-hidden">
          {thumbnailUrl ? (
            <Image
              {...bcms["blog-post"].thumbnail}
              alt={thumbnailAlt}
              className="reveal-slow absolute inset-0 h-full w-full object-cover"
              height={fields.thumbnail?.height ?? 1200}
              priority
              src={thumbnailUrl}
              width={fields.thumbnail?.width ?? 2000}
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f3d2e,#1f6f54)]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,43,32,0.25)_0%,rgba(16,42,67,0.82)_100%)]" />

          <div className="relative mx-auto flex min-h-[58vh] w-full max-w-4xl flex-col justify-end px-6 pb-14 pt-24">
            <Link
              className="reveal text-sm font-semibold uppercase tracking-[0.16em] text-white/75 transition hover:text-white"
              href="/blog"
            >
              ← Journal
            </Link>
            <div className="reveal-delay mt-8 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
              {fields.blog_number != null ? (
                <span {...bcms["blog-post"].blog_number}>
                  No. {fields.blog_number}
                </span>
              ) : null}
              {publishedDate ? (
                <span {...bcms["blog-post"].published}>{publishedDate}</span>
              ) : null}
              {author ? (
                <span {...bcms["blog-post"].author}>{author}</span>
              ) : null}
              {fields.is_featured ? (
                <span {...bcms["blog-post"].is_featured}>Featured</span>
              ) : null}
            </div>
            <h1
              {...bcms["blog-post"].name}
              className="reveal-delay display mt-5 max-w-3xl text-4xl font-bold text-white sm:text-6xl"
            >
              {fields.name}
            </h1>
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-6 py-16">
          {fields.content?.html ? (
            <div
              {...bcms["blog-post"].content}
              className="space-y-6 text-xl leading-9 text-[var(--ink)] [&_a]:text-[var(--brand)] [&_a]:underline [&_h2]:display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-[var(--brand)] [&_p]:leading-9"
              dangerouslySetInnerHTML={{ __html: fields.content.html }}
            />
          ) : null}

          <div className="mt-16">
            <BlogPostDetailActions fields={fields} slug={slug} />
          </div>
        </div>
      </article>
    </main>
  );
}
