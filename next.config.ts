import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // First-party proxy for PostHog (EU) so ad blockers and CSP don't drop events.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://eu-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://eu.i.posthog.com/:path*" },
    ];
  },
  // PostHog API paths end with "/"; Next must not redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
