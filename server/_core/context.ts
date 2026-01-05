
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { sdk } from "./sdk.js";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const user = await sdk.authenticateRequest(req);

  return {
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
