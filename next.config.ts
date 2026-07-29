import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the Turbopack project root explicitly. On Windows, when Next can't
  // determine the root it can fall into an infinite-compile loop that spawns
  // unbounded worker processes. `import.meta.dirname` is the ESM-safe form
  // (the old `__dirname` is undefined in ESM and was removed for that reason).
  turbopack: {
    root: import.meta.dirname,
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
