import { BetterCMS } from "@bettercms-ai/sdk";

import type { BetterCMSModelSlug } from "./bettercms.generated";

/** Prefer models/entries from this project when duplicate slugs exist across the workspace. */
const PROJECT_ID = process.env.BETTERCMS_PROJECT_ID ?? "Qvw2N8SeJ1JyuVkMAiF6E";

export function getManagementClient() {
  const apiKey = process.env.BETTERCMS_API_KEY;
  if (!apiKey) {
    throw new Error("BETTERCMS_API_KEY is required for write operations.");
  }

  return BetterCMS.management({
    baseUrl: "https://api.bettercms.ai/api/v1",
    apiKey,
  });
}

export async function getModelBySlug(slug: BetterCMSModelSlug) {
  const mgmt = getManagementClient();
  const models = await mgmt.listModels();
  const matches = models.filter((item) => item.slug === slug);

  const model =
    matches.find((item) => item.projectId === PROJECT_ID) ?? matches[0];

  if (!model) {
    throw new Error(`Model "${slug}" was not found.`);
  }

  return model;
}

export async function getEntryIdBySlug(
  modelSlug: BetterCMSModelSlug,
  entrySlug: string,
) {
  const model = await getModelBySlug(modelSlug);
  const mgmt = getManagementClient();
  const entries = await mgmt.listEntries({ modelId: model.id });
  const entry = entries.find((item) => item.slug === entrySlug);

  if (!entry) {
    throw new Error(`Entry "${entrySlug}" was not found.`);
  }

  return entry;
}
