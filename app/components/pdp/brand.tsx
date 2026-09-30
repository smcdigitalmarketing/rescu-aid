import { Star } from "lucide-react";
// The rescuaid.com header logo, with its white background made transparent.
import logoUrl from "~/assets/brand/rescuaid-logo.webp";

export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="RescUAid"
      width={900}
      height={216}
      className={`w-auto ${className}`}
    />
  );
}

export function Stars({
  rating = 5,
  className = "",
}: {
  rating?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex gap-0.5 ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className="size-4"
          fill={i < rating ? "#f5a524" : "none"}
          stroke={i < rating ? "#f5a524" : "currentColor"}
        />
      ))}
    </span>
  );
}
