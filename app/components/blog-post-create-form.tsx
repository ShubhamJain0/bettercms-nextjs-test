"use client";

import { useActionState } from "react";

import {
  createBlogPost,
  type BlogPostActionState,
} from "@/src/actions/blog-posts";
import { BlogPostFieldsForm } from "@/app/components/blog-post-fields";

const initialState: BlogPostActionState = {};

function StatusText({ state }: { state: BlogPostActionState }) {
  if (state.error) {
    return <p className="text-sm text-red-700">{state.error}</p>;
  }

  if (state.success) {
    return <p className="text-sm text-[var(--brand)]">{state.success}</p>;
  }

  return null;
}

export function BlogPostCreateForm() {
  const [state, action, pending] = useActionState(createBlogPost, initialState);

  return (
    <form action={action} className="space-y-5">
      <div>
        <h2 className="display text-2xl font-bold text-[var(--brand)]">
          Publish a new story
        </h2>
        <p className="mt-2 text-base leading-7 text-[var(--ink-soft)]">
          Writes directly to your BetterCMS <code>blog-post</code> collection.
        </p>
      </div>
      <BlogPostFieldsForm idPrefix="create-blog" />
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="bg-[var(--brand)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Publishing..." : "Publish"}
        </button>
        <StatusText state={state} />
      </div>
    </form>
  );
}
