import { useState } from "react";
import type { ResolvedImage } from "~/lib/images";

export function Picture({
  image,
  className = "",
  priority = false,
  fit = "cover",
}: {
  image: ResolvedImage;
  className?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}

/** Square product gallery with thumbnail strip. First image is the LCP element. */
export function Gallery({ images }: { images: ResolvedImage[] }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) return null;
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-card bg-surface-2">
        <Picture image={current} priority={index === 0} />
      </div>
      {images.length > 1 && (
        <div
          className="mt-3 grid grid-cols-5 gap-2"
          role="group"
          aria-label="Product images"
        >
          {images.map((im, i) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}: ${im.alt}`}
              aria-pressed={i === index}
              className={`aspect-square overflow-hidden rounded-[calc(var(--r-card)*0.6)] border-2 bg-surface-2 transition ${
                i === index
                  ? "border-brand"
                  : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <Picture image={im} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
