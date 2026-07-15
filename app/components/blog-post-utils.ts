import type { BlogPostFields } from "@/src/bettercms.generated";

type HydratedAuthor = {
  data?: {
    name?: string;
  };
  slug?: string;
  id?: string;
};

export function getAuthorInputValue(fields: Partial<BlogPostFields>) {
  const author = fields.author as string | HydratedAuthor | undefined;

  if (!author) {
    return "";
  }

  if (typeof author === "string") {
    return author;
  }

  return author.id ?? author.data?.name ?? author.slug ?? "";
}

export function getAuthorLabel(fields: Partial<BlogPostFields>) {
  const author = fields.author as string | HydratedAuthor | undefined;

  if (!author) {
    return null;
  }

  if (typeof author === "string") {
    return author;
  }

  return author.data?.name ?? author.slug ?? null;
}

export function getContentPreview(fields: Partial<BlogPostFields>) {
  const html = fields.content?.html ?? "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Short teaser for list pages — prefer an excerpt field when present. */
export function getExcerpt(fields: Partial<BlogPostFields>, maxLength = 160) {
  const explicit = (fields as { excerpt?: string }).excerpt?.trim();
  const source = explicit || getContentPreview(fields);
  if (!source) return "";
  if (source.length <= maxLength) return source;
  return `${source.slice(0, maxLength).trimEnd()}…`;
}

export function formatPublishedDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
