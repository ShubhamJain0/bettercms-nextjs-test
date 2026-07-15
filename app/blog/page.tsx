import Image from "next/image";
import Link from "next/link";

import { BlogPostCreateForm } from "@/app/components/blog-post-create-form";
import { BlogPostRow } from "@/app/components/blog-post-row";
import {
  formatPublishedDate,
  getExcerpt,
} from "@/app/components/blog-post-utils";
import { bcms } from "@/src/bettercms.bindings.generated";
import { cms } from "@/src/bettercms";

export default async function BlogPage() {
  const { items: posts } = await cms.listEntries("blog-post", {
    revalidate: 60,
    tags: ["blog-post"],
  });

  const sortedPosts = [...posts].sort((a, b) => {
    const aDate = a.fields.published ?? a.publishedAt ?? "";
    const bDate = b.fields.published ?? b.publishedAt ?? "";
    return bDate.localeCompare(aDate);
  });

  const featured =
    sortedPosts.find((post) => post.fields.is_featured) ?? sortedPosts[0];
  const remaining = sortedPosts.filter((post) => post.slug !== featured?.slug);

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-16">
        <p className="reveal font-mono text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">
          Journal
        </p>
        <h1 className="reveal display mt-4 max-w-3xl text-5xl font-bold text-[var(--brand)] sm:text-7xl">
          Notes from the studio floor.
        </h1>
        <p className="reveal-delay mt-6 max-w-2xl text-xl leading-8 text-[var(--ink-soft)]">
          Essays on product craft, publishing systems, and the work behind
          shipping clear content.
        </p>
      </section>

      {featured ? (
        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <Link
            className="group relative grid overflow-hidden border border-[var(--line)] bg-[var(--paper-deep)] lg:grid-cols-[1.15fr_0.85fr]"
            href={`/blog/${featured.slug}`}
          >
            <div className="relative min-h-[22rem] overflow-hidden">
              {featured.fields.thumbnail?.url ? (
                <Image
                  alt={
                    featured.fields.thumbnail.altText ??
                    featured.fields.name ??
                    "Featured post"
                  }
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  height={featured.fields.thumbnail.height ?? 900}
                  priority
                  src={featured.fields.thumbnail.url}
                  width={featured.fields.thumbnail.width ?? 1400}
                />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(135deg,#0f3d2e,#1f6f54)]" />
              )}
            </div>
            <div className="flex flex-col justify-end p-8 sm:p-10">
              <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                {featured.fields.is_featured ? <span>Featured</span> : null}
                {featured.fields.blog_number != null ? (
                  <span>No. {featured.fields.blog_number}</span>
                ) : null}
                <span>
                  {formatPublishedDate(
                    featured.fields.published ?? featured.publishedAt,
                  )}
                </span>
              </div>
              <h2
                {...bcms["blog-post"].name}
                className="display mt-5 text-4xl font-bold text-[var(--ink)] transition group-hover:text-[var(--brand)] sm:text-5xl"
              >
                {featured.fields.name}
              </h2>
              <p className="mt-4 text-lg leading-8 text-[var(--ink-soft)]">
                {getExcerpt(featured.fields)}
              </p>
              <span className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                Read story
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-3xl font-bold text-[var(--brand)] sm:text-4xl">
            All stories
          </h2>
        </div>

        <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {remaining.length === 0 && !featured ? (
            <p className="py-10 text-lg text-[var(--ink-soft)]">
              No posts published yet.
            </p>
          ) : remaining.length === 0 ? (
            <p className="py-10 text-lg text-[var(--ink-soft)]">
              More stories will appear here as they publish.
            </p>
          ) : (
            remaining.map((post) => <BlogPostRow key={post.slug} post={post} />)
          )}
        </div>

        <details className="mt-16 border border-[var(--line)] bg-[var(--paper-deep)] open:bg-[var(--paper)]">
          <summary className="cursor-pointer list-none px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:text-[var(--ink)]">
            Studio tools · write a new post
          </summary>
          <div className="border-t border-[var(--line)] px-6 py-6">
            <BlogPostCreateForm />
          </div>
        </details>
      </section>
    </main>
  );
}
