"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  getEntryIdBySlug,
  getManagementClient,
  getModelBySlug,
} from "@/src/bettercms-management";

const MODEL_SLUG = "blog-post" as const;

export type BlogPostActionState = {
  error?: string;
  success?: string;
};

function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `post-${Date.now()}`;
}

function buildBlogPostData(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const author = formData.get("author")?.toString().trim();
  const thumbnail = formData.get("thumbnail")?.toString().trim();
  const contentRaw = formData.get("content")?.toString().trim();
  const published = formData.get("published")?.toString().trim();
  const blogNumberRaw = formData.get("blog_number")?.toString().trim();
  const isFeatured = formData.get("is_featured") === "true";

  const data: Record<string, unknown> = {
    name,
    is_featured: isFeatured,
  };

  if (author) data.author = author;
  if (thumbnail) data.thumbnail = thumbnail;
  if (published) data.published = published;
  if (blogNumberRaw) {
    const blogNumber = Number(blogNumberRaw);
    if (!Number.isNaN(blogNumber)) {
      data.blog_number = blogNumber;
    }
  }
  if (contentRaw) {
    data.content = contentRaw.includes("<")
      ? { html: contentRaw }
      : { html: `<p>${contentRaw}</p>` };
  }

  return { name, data };
}

function revalidateBlogPost(slug?: string) {
  revalidateTag("blog-post", "max");
  if (slug) {
    revalidateTag(`blog-post:${slug}`, "max");
  }
}

function actionError(error: unknown, fallback: string): BlogPostActionState {
  return {
    error: error instanceof Error ? error.message : fallback,
  };
}

export async function createBlogPost(
  _prev: BlogPostActionState,
  formData: FormData,
): Promise<BlogPostActionState> {
  const { name, data } = buildBlogPostData(formData);

  if (!name) {
    return { error: "Name is required." };
  }

  const slug = slugify(name);

  try {
    const mgmt = getManagementClient();
    const model = await getModelBySlug(MODEL_SLUG);

    await mgmt.createEntry({
      contentModelId: model.id,
      slug,
      status: "published",
      data,
    });

    revalidateBlogPost(slug);
  } catch (error) {
    return actionError(
      error,
      "Failed to create blog post. Your API key may need project-scoped content:manage access.",
    );
  }

  redirect(`/blog/${slug}`);
}

export async function updateBlogPost(
  _prev: BlogPostActionState,
  formData: FormData,
): Promise<BlogPostActionState> {
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const { name, data } = buildBlogPostData(formData);

  if (!slug || !name) {
    return { error: "Slug and name are required." };
  }

  try {
    const entry = await getEntryIdBySlug(MODEL_SLUG, slug);
    const mgmt = getManagementClient();

    await mgmt.updateEntry(entry.id, {
      status: "published",
      data,
    });

    revalidateBlogPost(slug);
    return { success: `Updated "${name}".` };
  } catch (error) {
    return actionError(error, "Failed to update blog post.");
  }
}

export async function deleteBlogPost(
  _prev: BlogPostActionState,
  formData: FormData,
): Promise<BlogPostActionState> {
  const slug = formData.get("slug")?.toString().trim() ?? "";

  if (!slug) {
    return { error: "Slug is required." };
  }

  try {
    const entry = await getEntryIdBySlug(MODEL_SLUG, slug);
    const mgmt = getManagementClient();

    await mgmt.deleteEntry(entry.id);
    revalidateBlogPost(slug);
  } catch (error) {
    return actionError(error, "Failed to delete blog post.");
  }

  redirect("/blog");
}
