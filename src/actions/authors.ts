"use server";

import { revalidateTag } from "next/cache";

import type { AuthorsFields } from "@/src/bettercms.generated";
import {
  getEntryIdBySlug,
  getManagementClient,
  getModelBySlug,
} from "@/src/bettercms-management";

export type AuthorActionState = {
  error?: string;
  success?: string;
};

function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `author-${Date.now()}`;
}

function actionError(error: unknown, fallback: string): AuthorActionState {
  return {
    error: error instanceof Error ? error.message : fallback,
  };
}

export async function createAuthor(
  _prev: AuthorActionState,
  formData: FormData,
): Promise<AuthorActionState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const bio = formData.get("bio")?.toString().trim() ?? "";

  if (!name) {
    return { error: "Name is required." };
  }

  try {
    const mgmt = getManagementClient();
    const model = await getModelBySlug("authors");
    const data: AuthorsFields = { name, bio: bio || undefined };

    await mgmt.createEntry({
      contentModelId: model.id,
      slug: slugify(name),
      status: "published",
      data: { ...data },
    });

    revalidateTag("authors", "max");
    return { success: `Created "${name}".` };
  } catch (error) {
    return actionError(
      error,
      "Failed to create author. Your API key may need project-scoped content:manage access.",
    );
  }
}

export async function updateAuthor(
  _prev: AuthorActionState,
  formData: FormData,
): Promise<AuthorActionState> {
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const bio = formData.get("bio")?.toString().trim() ?? "";

  if (!slug || !name) {
    return { error: "Slug and name are required." };
  }

  try {
    const entry = await getEntryIdBySlug("authors", slug);
    const mgmt = getManagementClient();
    const data: AuthorsFields = { name, bio: bio || undefined };

    await mgmt.updateEntry(entry.id, {
      status: "published",
      data: { ...data },
    });

    revalidateTag("authors", "max");
    return { success: `Updated "${name}".` };
  } catch (error) {
    return actionError(error, "Failed to update author.");
  }
}

export async function deleteAuthor(
  _prev: AuthorActionState,
  formData: FormData,
): Promise<AuthorActionState> {
  const slug = formData.get("slug")?.toString().trim() ?? "";

  if (!slug) {
    return { error: "Slug is required." };
  }

  try {
    const entry = await getEntryIdBySlug("authors", slug);
    const mgmt = getManagementClient();

    await mgmt.deleteEntry(entry.id);
    revalidateTag("authors", "max");

    return { success: `Deleted "${slug}".` };
  } catch (error) {
    return actionError(error, "Failed to delete author.");
  }
}
