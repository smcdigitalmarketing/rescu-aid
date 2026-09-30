import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("v1", "routes/v1.tsx"),
  route("v2", "routes/v2.tsx"),
  route("v3", "routes/v3.tsx"),
  route("ads", "routes/ads.tsx"),
  route("ads/render/:kind/:id", "routes/ads.render.tsx"),
] satisfies RouteConfig;
