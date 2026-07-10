import { createBetterCMS } from "@bettercms-ai/next";

import type { BetterCMSSchema } from "./bettercms.generated";

export const cms = createBetterCMS<BetterCMSSchema & Record<string, unknown>>({
  baseUrl: "https://api.bettercms.ai/api/v1/delivery",
  workspace: "kotechashubham94gmailcom",
  apiKey: process.env.BETTERCMS_API_KEY,
  revalidate: 60,
});
