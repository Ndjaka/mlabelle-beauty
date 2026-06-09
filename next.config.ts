import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@supabase/ssr", "@supabase/supabase-js", "resend"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
