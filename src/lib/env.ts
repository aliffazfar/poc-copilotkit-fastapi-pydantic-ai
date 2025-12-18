import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL: z.string().url().default("http://localhost:3000/api/copilotkit"),
  NEXT_PUBLIC_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Jom Kira"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL: process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL,
  NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});