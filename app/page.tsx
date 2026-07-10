import { AuthorAdmin } from "@/app/components/author-admin";
import { bcms } from "@/src/bettercms.bindings.generated";
import { cms } from "@/src/bettercms";

export default async function Home() {
  const { items: authors } = await cms.listEntries("authors", {
    revalidate: 60,
    tags: ["authors"],
  });

  const [featuredAuthor] = authors;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-10 rounded-3xl bg-white px-8 py-12 shadow-sm dark:bg-zinc-950 sm:px-12">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            BetterCMS delivery demo
          </p>
          {featuredAuthor ? (
            <>
              <h1
                {...bcms.authors.name}
                className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
              >
                {featuredAuthor.fields.name}
              </h1>
              <p
                {...bcms.authors.bio}
                className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300"
              >
                {featuredAuthor.fields.bio}
              </p>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-8 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
              No authors have been published in BetterCMS yet.
            </div>
          )}
        </div>

        <AuthorAdmin authors={authors} />
      </main>
    </div>
  );
}
