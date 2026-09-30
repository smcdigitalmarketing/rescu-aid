import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Every PDP is static HTML, so the pages can be served from any CDN.
  async prerender() {
    return ["/", "/v1", "/v2", "/v3", "/demo/v1", "/demo/v2", "/demo/v3", "/ads"];
  },
} satisfies Config;
