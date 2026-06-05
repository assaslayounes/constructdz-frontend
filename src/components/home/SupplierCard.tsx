import { MapPin, Star } from "lucide-react";
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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">

      {/* Cover banner */}
      <div className="relative h-20 bg-gradient-to-br from-slate-700 to-slate-800 sm:h-24">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />
      </div>

      {/* Avatar — centered, overlapping cover */}
      <div className="relative flex justify-center">
        <div className="-mt-10 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md sm:-mt-12 sm:h-24 sm:w-24">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2 text-right sm:px-5 sm:pb-5 sm:pt-3">

        {/* Name */}
        <h3 className="text-center text-base font-extrabold leading-snug text-neutral-900 sm:text-lg">
          {title}
        </h3>

        {/* Rating row */}
        <div className="mt-2 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
            <Star className="size-3.5 fill-current sm:size-4" />
            <span>{rating}</span>
          </div>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="text-xs text-neutral-500">{reviews}+ تقييم</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:text-xs",
                  i % 2 === 0
                    ? "bg-amber-50 text-amber-700"
                    : "bg-blue-50 text-blue-700"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-500">
          <MapPin className="size-3.5 shrink-0 sm:size-4" />
          <span className="truncate">{location}</span>
        </div>

        {/* CTA */}
        <a
          href="#"
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-amber-500 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-amber-600 active:scale-[.98]"
        >
          عرض التفاصيل
        </a>
      </div>
    </article>
  );
}