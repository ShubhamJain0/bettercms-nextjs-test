import { BlogPostCreateForm } from "@/app/components/blog-post-create-form";
import { BlogPostRow } from "@/app/components/blog-post-row";
import { cms } from "@/src/bettercms";

export default async function BlogPage() {
  const { items: posts } = await cms.listEntries("blog-post", {
    revalidate: 60,
    tags: ["blog-post"],
  });

  const sortedPosts = [...posts].sort((a, b) => {
    const aDate = a.publishedAt ?? "";
    const bDate = b.publishedAt ?? "";
    return bDate.localeCompare(aDate);
  });

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col gap-10">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            BetterCMS blog
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Blog posts
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Posts from your project&apos;s <code>blog-post</code> collection.
            Click a name to open the dedicated detail page.
          </p>
        </div>

        <BlogPostCreateForm />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            All posts
          </h2>
          {sortedPosts.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              No blog posts yet. Publish your first one above.
            </p>
          ) : (
            <div className="grid gap-4">
              {sortedPosts.map((post) => (
                <BlogPostRow key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
