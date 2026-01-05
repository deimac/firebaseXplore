import { ENV } from "./env.js";
import { publicProcedure, router } from "./trpc.js";

export const systemRouter = router({
  env: publicProcedure.query(() => {
    // Return a subset of environment variables considered safe for the client
    return {
      nodeEnv: ENV.nodeEnv,
      isDevelopment: ENV.isDevelopment,
      isProduction: ENV.isProduction,
    };
  }),
});
