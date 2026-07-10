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
    return <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>;
  }

  if (state.success) {
    return (
      <p className="text-sm text-emerald-600 dark:text-emerald-400">
        {state.success}
      </p>
    );
  }

  return null;
}

export function BlogPostCreateForm() {
  const [state, action, pending] = useActionState(createBlogPost, initialState);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Write a new post
      </h2>
      <BlogPostFieldsForm idPrefix="create-blog" />
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          disabled={pending}
          type="submit"
        >
          {pending ? "Publishing..." : "Publish post"}
        </button>
        <StatusText state={state} />
      </div>
    </form>
  );
}
