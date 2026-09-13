import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the Turbopack project root explicitly. On Windows, when Next can't
  // determine the root it can fall into an infinite-compile loop that spawns
  // unbounded worker processes. `import.meta.dirname` is the ESM-safe form.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
