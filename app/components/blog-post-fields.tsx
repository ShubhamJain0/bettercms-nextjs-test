import type { BlogPostFields } from "@/src/bettercms.generated";

import {
  getAuthorInputValue,
  getContentPreview,
} from "@/app/components/blog-post-utils";

export const blogFieldClassName =
  "w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-base text-[var(--ink)] outline-none transition focus:border-[var(--brand)]";

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
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
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
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
          Content
        </span>
        <textarea
          className={`${blogFieldClassName} min-h-40 font-mono text-sm`}
          defaultValue={fields?.content?.html ?? getContentPreview(fields ?? {})}
          id={`${idPrefix}-content`}
          name="content"
          placeholder="HTML or plain text"
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
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
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
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
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
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
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
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
            className="size-4 border-[var(--line)]"
            defaultChecked={Boolean(fields?.is_featured)}
            id={`${idPrefix}-is-featured`}
            name="is_featured"
            type="checkbox"
            value="true"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
            Featured
          </span>
        </label>
      </div>
    </div>
  );
}
