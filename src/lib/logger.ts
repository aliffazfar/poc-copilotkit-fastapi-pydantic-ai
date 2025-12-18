import pino from "pino";
import { env } from "./env";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: env.NEXT_PUBLIC_LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      }
    : undefined,
  browser: {
    asObject: true,
  },
});