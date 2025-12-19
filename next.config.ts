import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pino and pino-pretty use thread-stream which requires Node.js worker threads
  // Turbopack has a known issue tracing these dependencies, so we externalize them
  // See: https://github.com/vercel/next.js/issues/84766
  serverExternalPackages: ["@copilotkit/runtime", "pino", "pino-pretty"],
};

export default nextConfig;
