/** Final exported creatives (scripts/export-ads.ts, scripts/build-videos.ts). */
const files = import.meta.glob<string>("../assets/ads/*.{png,jpg,mp4}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function adAsset(name: string): string | undefined {
  return files[`../assets/ads/${name}`];
}

export const AD_FONTS =
  "family=Inter:wght@400;500;600;700;900&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Oswald:wght@500;600;700";
