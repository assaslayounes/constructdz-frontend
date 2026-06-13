import { MapPin, Settings, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  tags: string[];
}

export function SupplierCard({ title, image, location, rating, reviews, tags }: Props) {
  return (
    <article className="soft-card flex min-h-[200px] flex-col justify-between p-5 transition-all duration-200 hover:shadow-md sm:min-h-[220px] sm:p-6">
      {/* Top Section: Image and Main Info */}
      <div className="flex items-start gap-4 sm:gap-5">
        {/* Image: Naturally appears on the right in RTL layouts */}
        <img
          src={image}
          alt={title}
          className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-black/5 sm:size-20"
        />

        {/* Content: Naturally appears on the left in RTL layouts */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Title: Max 2 lines, graceful wrapping, reduced visual weight */}
              <h3 className="text-base font-bold leading-snug text-black line-clamp-2 break-words sm:text-lg">
                {title}
              </h3>

              {/* Rating & Reviews: Cleaner, more structured grouping */}
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="flex items-center gap-1 font-bold text-brand-orange">
                  {rating}
                  <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </span>
                <span className="text-xs text-brand-muted">({reviews}+ تقييم)</span>
              </div>
            </div>

            {/* Settings Icon: Properly aligned without magic margins */}
            <Settings className="mt-1 size-5 shrink-0 text-blue-700" aria-hidden="true" />
          </div>

          {/* Tags: Cleaner, uniform, and easier to scan */}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                  i === 0
                    ? "bg-orange-50 text-brand-orange ring-orange-100"
                    : "bg-blue-50 text-blue-700 ring-blue-100"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Location and Action */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
        {/* Location: Right-aligned in RTL, truncated to prevent layout shifts */}
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-brand-muted sm:text-sm">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </span>

        {/* Action Link: Left-aligned in RTL, with interactive hover micro-animation */}
        <a
          href="#"
          className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-brown transition-colors hover:text-brand-orange sm:text-base"
        >
          عرض التفاصيل
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}