import { MapPin, Settings } from "lucide-react";
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
    <article className="soft-card flex min-h-[210px] flex-col justify-between p-6 sm:min-h-[220px] sm:p-8">
      <div className="flex items-start gap-4 sm:gap-5">
        <Settings className="mt-8 size-5 shrink-0 text-blue-700 sm:mt-9" />
        <div className="min-w-0 flex-1 text-right">
          <div className="flex items-start justify-end gap-4 sm:gap-5">
            <div className="min-w-0">
              <h3 className="max-w-[260px] text-xl font-extrabold leading-8 text-black sm:text-2xl sm:leading-9">{title}</h3>
              <p className="mt-1 text-sm text-brand-muted">({reviews}+ تقييم) <span className="font-bold text-brand-orange">{rating}</span> ☆</p>
            </div>
            <img src={image} alt="" className="size-14 shrink-0 rounded-2xl object-cover sm:size-16" />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2 sm:gap-3">
            {tags.map((tag, i) => <span key={tag} className={cn("rounded-full px-3 py-1 text-xs font-bold sm:px-4 sm:text-sm", i ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-brand-orange")}>{tag}</span>)}
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/5 pt-5">
        <a className="shrink-0 text-sm font-bold text-brand-brown sm:text-base" href="#">عرض التفاصيل ←</a>
        <span className="flex min-w-0 items-center gap-1 text-sm text-brand-muted"><MapPin className="size-4 shrink-0" />{location}</span>
      </div>
    </article>
  );
}
