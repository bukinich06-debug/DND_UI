import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  experimental: {
    // Required on Next.js < 16.3 for next/root-params
    rootParams: true,
  },
}

export default withNextIntl(nextConfig)
