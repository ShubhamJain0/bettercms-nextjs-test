"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  deleteBlogPost,
  updateBlogPost,
  type BlogPostActionState,
} from "@/src/actions/blog-posts";
import { BlogPostFieldsForm } from "@/app/components/blog-post-fields";
import type { BlogPostFields } from "@/src/bettercms.generated";

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

export function BlogPostDetailActions({
  slug,
  fields,
}: {
  slug: string;
  fields: BlogPostFields;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateBlogPost,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteBlogPost,
    initialState,
  );

  const [ackSuccess, setAckSuccess] = useState(updateState.success);
  if (updateState.success !== ackSuccess) {
    setAckSuccess(updateState.success);
    if (updateState.success) {
      setIsEditing(false);
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Manage post
        </h2>
        <Link
          className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          href="/blog"
        >
          Back to all posts
        </Link>
      </div>

      {isEditing ? (
        <form action={updateAction} className="space-y-4">
          <input name="slug" type="hidden" value={slug} />
          <BlogPostFieldsForm fields={fields} idPrefix={`detail-${slug}`} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              disabled={updatePending}
              type="submit"
            >
              {updatePending ? "Saving..." : "Save changes"}
            </button>
            <button
              className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancel
            </button>
            <StatusText state={updateState} />
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            Edit post
          </button>
          <form action={deleteAction}>
            <input name="slug" type="hidden" value={slug} />
            <button
              className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
              disabled={deletePending}
              type="submit"
            >
              {deletePending ? "Deleting..." : "Delete post"}
            </button>
          </form>
          <StatusText state={deleteState} />
        </div>
      )}
    </section>
  );
}
