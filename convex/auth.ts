import { betterAuth } from "better-auth";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: (globalThis as any).process?.env?.CONVEX_SITE_URL as string,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      convex({ authConfig }),
    ],
  });
};

export const { getAuthUser } = authComponent.clientApi();
export { authComponent };
