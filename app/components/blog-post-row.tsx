"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  deleteBlogPost,
  updateBlogPost,
  type BlogPostActionState,
} from "@/src/actions/blog-posts";
import { BlogPostFieldsForm } from "@/app/components/blog-post-fields";
import {
  formatPublishedDate,
  getAuthorLabel,
  getExcerpt,
} from "@/app/components/blog-post-utils";
import type { BlogPostFields } from "@/src/bettercms.generated";

type BlogPostItem = {
  slug: string;
  fields: BlogPostFields;
  publishedAt?: string | null;
};

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

export function BlogPostRow({ post }: { post: BlogPostItem }) {
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

  const author = getAuthorLabel(post.fields);
  const publishedDate = formatPublishedDate(
    post.fields.published ?? post.publishedAt,
  );
  const preview = getExcerpt(post.fields);

  return (
    <article className="py-8">
      {isEditing ? (
        <form action={updateAction} className="space-y-4">
          <input name="slug" type="hidden" value={post.slug} />
          <BlogPostFieldsForm fields={post.fields} idPrefix={`edit-${post.slug}`} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="bg-[var(--brand)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-60"
              disabled={updatePending}
              type="submit"
            >
              {updatePending ? "Saving..." : "Save"}
            </button>
            <button
              className="px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancel
            </button>
            <StatusText state={updateState} />
          </div>
        </form>
      ) : (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
          <Link className="group min-w-0" href={`/blog/${post.slug}`}>
            <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-soft)]">
              {post.fields.blog_number != null ? (
                <span>No. {post.fields.blog_number}</span>
              ) : null}
              {publishedDate ? <span>{publishedDate}</span> : null}
              {author ? <span>{author}</span> : null}
              {post.fields.is_featured ? <span>Featured</span> : null}
            </div>
            <h3 className="display mt-3 text-3xl font-bold text-[var(--ink)] transition group-hover:text-[var(--brand)]">
              {post.fields.name}
            </h3>
            {preview ? (
              <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
                {preview}
              </p>
            ) : null}
          </Link>

          <div className="flex shrink-0 items-center gap-2 opacity-70 transition hover:opacity-100">
            <button
              className="border border-[var(--line)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              Edit
            </button>
            <form action={deleteAction}>
              <input name="slug" type="hidden" value={post.slug} />
              <button
                className="border border-[var(--line)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)] transition hover:border-red-700 hover:text-red-700 disabled:opacity-60"
                disabled={deletePending}
                type="submit"
              >
                {deletePending ? "..." : "Delete"}
              </button>
            </form>
          </div>
        </div>
      )}
      {!isEditing ? <StatusText state={deleteState} /> : null}
    </article>
  );
}
