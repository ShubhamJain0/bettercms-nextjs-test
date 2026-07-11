import type { BlogPostFields } from "@/src/bettercms.generated";

import {
  getAuthorInputValue,
  getContentPreview,
} from "@/app/components/blog-post-utils";

export const blogFieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

type BlogPostFieldsProps = {
  fields?: Partial<BlogPostFields>;
  idPrefix?: string;
};

export function BlogPostFieldsForm({
  fields,
  idPrefix = "blog",
}: BlogPostFieldsProps) {
  return (
    <div className="grid gap-4">
      <label className="space-y-1.5 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          Name
        </span>
        <input
          className={blogFieldClassName}
          defaultValue={fields?.name ?? ""}
          id={`${idPrefix}-name`}
          name="name"
          placeholder="Post name"
          required
        />
      </label>

      <label className="space-y-1.5 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          Content
        </span>
        <textarea
          className={`${blogFieldClassName} min-h-40 font-mono`}
          defaultValue={fields?.content?.html ?? getContentPreview(fields ?? {})}
          id={`${idPrefix}-content`}
          name="content"
          placeholder="HTML or plain text"
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Author
          </span>
          <input
            className={blogFieldClassName}
            defaultValue={getAuthorInputValue(fields ?? {})}
            id={`${idPrefix}-author`}
            name="author"
            placeholder="Author reference id"
          />
        </label>

        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Thumbnail URL
          </span>
          <input
            className={blogFieldClassName}
            defaultValue={fields?.thumbnail?.url ?? ""}
            id={`${idPrefix}-thumbnail`}
            name="thumbnail"
            placeholder="https://cdn.bettercms.ai/..."
            required
            type="url"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Published
          </span>
          <input
            className={blogFieldClassName}
            defaultValue={fields?.published ?? ""}
            id={`${idPrefix}-published`}
            name="published"
            type="date"
          />
        </label>

        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Blog number
          </span>
          <input
            className={blogFieldClassName}
            defaultValue={
              fields?.blog_number != null ? String(fields.blog_number) : ""
            }
            id={`${idPrefix}-blog-number`}
            min={0}
            name="blog_number"
            placeholder="1"
            type="number"
          />
        </label>

        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            className="size-4 rounded border-zinc-300"
            defaultChecked={Boolean(fields?.is_featured)}
            id={`${idPrefix}-is-featured`}
            name="is_featured"
            type="checkbox"
            value="true"
          />
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            Featured
          </span>
        </label>
      </div>
    </div>
  );
}
