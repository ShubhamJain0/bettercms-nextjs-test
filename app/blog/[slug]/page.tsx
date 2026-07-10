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

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await cms.getEntry(slug, {
    revalidate: 60,
    tags: ["blog-post", `blog-post:${slug}`],
    depth: 1,
  });

  if (!post) {
    notFound();
  }

  const { fields } = post;
  const author = getAuthorLabel(fields);
  const publishedDate = formatPublishedDate(post.publishedAt);
  const thumbnailUrl = fields.thumbnail?.url;
  const thumbnailAlt =
    fields.thumbnail?.altText ?? fields.name ?? "Post thumbnail";

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <article className="flex w-full max-w-3xl flex-col gap-8">
        <div className="space-y-4">
          <Link
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            href="/blog"
          >
            ← All posts
          </Link>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
            {publishedDate ? <span>{publishedDate}</span> : null}
            {author ? <span {...bcms["blog-post"].author}>{author}</span> : null}
          </div>

          <h1
            {...bcms["blog-post"].name}
            className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            {fields.name}
          </h1>
        </div>

        {thumbnailUrl ? (
          <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <Image
              {...bcms["blog-post"].thumbnail}
              alt={thumbnailAlt}
              className="h-auto w-full object-cover"
              height={fields.thumbnail?.height ?? 720}
              priority
              src={thumbnailUrl}
              width={fields.thumbnail?.width ?? 1280}
            />
          </div>
        ) : null}

        {fields.content?.html ? (
          <div
            {...bcms["blog-post"].content}
            className="space-y-4 text-base leading-8 text-zinc-700 dark:text-zinc-300 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-zinc-950 [&_h2]:dark:text-zinc-50 [&_p]:leading-8"
            dangerouslySetInnerHTML={{ __html: fields.content.html }}
          />
        ) : null}

        <BlogPostDetailActions fields={fields} slug={slug} />
      </article>
    </div>
  );
}
