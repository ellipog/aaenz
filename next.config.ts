import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the Turbopack project root explicitly. On Windows, when Next can't
  // determine the root it can fall into an infinite-compile loop that spawns
  // unbounded worker processes. `import.meta.dirname` is the ESM-safe form.
  turbopack: {
    root: import.meta.dirname,
  },
  // One origin, one page: www answers on its own otherwise, and two live hosts
  // for the same markup split the signals the canonical is meant to merge.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aaenz.no" }],
        destination: "https://aaenz.no/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
