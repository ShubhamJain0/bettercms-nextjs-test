"use client";

import { useActionState, useState } from "react";

import {
  createAuthor,
  deleteAuthor,
  updateAuthor,
  type AuthorActionState,
} from "@/src/actions/authors";
import type { AuthorsFields } from "@/src/bettercms.generated";

type AuthorItem = {
  slug: string;
  fields: AuthorsFields;
};

const initialState: AuthorActionState = {};

const fieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

function StatusText({ state }: { state: AuthorActionState }) {
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

function CreateAuthorForm() {
  const [state, action, pending] = useActionState(createAuthor, initialState);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Add a new author
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Name
          </span>
          <input
            className={fieldClassName}
            name="name"
            placeholder="Author name"
            required
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Bio
          </span>
          <input className={fieldClassName} name="bio" placeholder="Short bio" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          disabled={pending}
          type="submit"
        >
          {pending ? "Creating..." : "Create author"}
        </button>
        <StatusText state={state} />
      </div>
    </form>
  );
}

function AuthorRow({ author }: { author: AuthorItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateAuthor,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteAuthor,
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
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      {isEditing ? (
        <form action={updateAction} className="space-y-4">
          <input name="slug" type="hidden" value={author.slug} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                Name
              </span>
              <input
                className={fieldClassName}
                defaultValue={author.fields.name ?? ""}
                name="name"
                required
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                Bio
              </span>
              <input
                className={fieldClassName}
                defaultValue={author.fields.bio ?? ""}
                name="bio"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              disabled={updatePending}
              type="submit"
            >
              {updatePending ? "Saving..." : "Save"}
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
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              {author.fields.name}
            </h3>
            <p className="mt-1 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {author.fields.bio || "No bio yet."}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              Edit
            </button>
            <form action={deleteAction}>
              <input name="slug" type="hidden" value={author.slug} />
              <button
                className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                disabled={deletePending}
                type="submit"
              >
                {deletePending ? "Deleting..." : "Delete"}
              </button>
            </form>
          </div>
        </div>
      )}
      {!isEditing && <StatusText state={deleteState} />}
    </article>
  );
}

export function AuthorAdmin({ authors }: { authors: AuthorItem[] }) {
  return (
    <section className="space-y-6">
      <CreateAuthorForm />

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Authors
        </h2>
        {authors.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            No authors yet. Create your first one above.
          </p>
        ) : (
          <div className="grid gap-3">
            {authors.map((author) => (
              <AuthorRow author={author} key={author.slug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
