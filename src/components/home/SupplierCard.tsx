import { MapPin, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  tags: string[];
}

export function SupplierCard({
  title,
  image,
  location,
  rating,
  reviews,
  tags,
}: Props) {
  return (
    <article className="soft-card relative flex min-h-[210px] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:min-h-[220px]">
      {/* Top Section */}
      <div className="relative h-[95px] bg-slate-700 sm:h-[105px]">
        <Settings className="absolute right-5 top-5 size-5 text-white/80" />
      </div>

      {/* Profile Image */}
      <div className="absolute left-1/2 top-[95px] z-10 -translate-x-1/2 -translate-y-1/2 sm:top-[105px]">
        <img
          src={image}
          alt={title}
          className="size-24 rounded-full border-4 border-white object-cover shadow-lg ring-1 ring-black/10 sm:size-28"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col bg-white px-5 pb-5 pt-16 text-right sm:px-6 sm:pb-6 sm:pt-20">
        {/* Name */}
        <h3 className="text-center text-lg font-extrabold leading-7 text-slate-950 sm:text-xl">
          {title}
        </h3>

        {/* Rating */}
        <div className="mt-3 flex items-center justify-center gap-3 rounded-full bg-orange-100/60 px-3 py-2">
          <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
            <Star className="size-4 fill-current" />
            {rating}
          </span>

          <span className="text-xs font-semibold text-slate-500">
            {reviews}+ تقييم
          </span>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <div className="mb-2 text-sm font-extrabold text-slate-900">
            المهارات
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold",
                  i % 2 === 0
                    ? "bg-orange-50 text-orange-600"
                    : "bg-blue-50 text-blue-700"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="mt-4">
          <p className="text-sm leading-6 text-slate-600">
            حرفي محترف يقدّم خدمات عالية الجودة بإتقان وخبرة، ملتزم بالدقة
            والمواعيد ورضا العملاء، ويضمن تنفيذ الأعمال بأفضل المعايير.
          </p>
        </div>

        {/* Location */}
        <div className="mt-4">
          <h4 className="mb-1 text-sm font-extrabold text-slate-900">
            الموقع
          </h4>

          <div className="flex items-center justify-end gap-1 text-sm text-slate-600">
            <MapPin className="size-4 shrink-0 text-slate-500" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto pt-4">
          <a
  href="#"
  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500/80 px-4 py-3 text-center text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-orange-500"
>
  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
  رجوع
</a>
        </div>
      </div>
    </article>
  );
}