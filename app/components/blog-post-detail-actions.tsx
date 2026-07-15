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
    return <p className="text-sm text-red-700">{state.error}</p>;
  }

  if (state.success) {
    return <p className="text-sm text-[var(--brand)]">{state.success}</p>;
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
    <details className="border border-[var(--line)] bg-[var(--paper-deep)] open:bg-[var(--paper)]">
      <summary className="cursor-pointer list-none px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)] transition hover:text-[var(--ink)]">
        Studio tools · edit or delete
      </summary>
      <div className="space-y-4 border-t border-[var(--line)] px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--ink-soft)]">
            Manage this story without leaving the page.
          </p>
          <Link
            className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--brand)]"
            href="/blog"
          >
            Back to journal
          </Link>
        </div>

        {isEditing ? (
          <form action={updateAction} className="space-y-4">
            <input name="slug" type="hidden" value={slug} />
            <BlogPostFieldsForm fields={fields} idPrefix={`detail-${slug}`} />
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="bg-[var(--brand)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-60"
                disabled={updatePending}
                type="submit"
              >
                {updatePending ? "Saving..." : "Save changes"}
              </button>
              <button
                className="px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]"
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
              className="border border-[var(--line)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)] transition hover:border-[var(--brand)]"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              Edit post
            </button>
            <form action={deleteAction}>
              <input name="slug" type="hidden" value={slug} />
              <button
                className="border border-[var(--line)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)] transition hover:border-red-700 hover:text-red-700 disabled:opacity-60"
                disabled={deletePending}
                type="submit"
              >
                {deletePending ? "Deleting..." : "Delete post"}
              </button>
            </form>
            <StatusText state={deleteState} />
          </div>
        )}
      </div>
    </details>
  );
}
