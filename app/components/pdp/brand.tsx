import { Star } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-black tracking-tight ${className}`}
      aria-label="RescUAid"
    >
      <svg viewBox="0 0 24 28" className="h-[1.1em] w-auto" aria-hidden="true">
        <path
          d="M12 1.5 21.5 5v8c0 6.6-4.1 10.9-9.5 13.4C6.6 23.9 2.5 19.6 2.5 13V5z"
          fill="#fff"
          stroke="#13306b"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M10.2 8.5h3.6v4.2H18v3.6h-4.2v4.2h-3.6v-4.2H6v-3.6h4.2z"
          fill="#13306b"
        />
      </svg>
      <span aria-hidden="true">
        <span className="text-red">RescU</span>
        <span className="text-navy">Aid</span>
      </span>
    </span>
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
