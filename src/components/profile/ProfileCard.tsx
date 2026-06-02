import { Mail, Pencil, Share2 } from "lucide-react";
import type { Profile, User } from "@/types/domain";

type Props = {
  user: User;
  profile?: Profile | null;
  onImageChange?: (file: File) => void;
};

export function ProfileCard({ user, profile, onImageChange }: Props) {
  const image = profile?.profileImage || profile?.avatarUrl || user.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=240&auto=format&fit=crop";
  const name = user.name || profile?.companyName || "أحمد المنصوري";
  const experience = profile?.experienceYears ?? 15;

  return (
    <article className="relative overflow-hidden rounded-lg border border-brand-border bg-white px-6 pb-7 pt-8 text-center shadow-sm">
      <div className="absolute -right-16 -top-16 size-40 rounded-full bg-[#fff0e4]" />
      <div className="relative mx-auto size-[126px]">
        <img src={image} alt={name} className="size-[126px] rounded-full border-4 border-brand-brown object-cover shadow-lg" />
        <label className="absolute bottom-0 right-0 grid size-12 cursor-pointer place-items-center rounded-full bg-brand-brown text-white shadow-md">
          <Pencil className="size-5" />
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImageChange?.(file);
            }}
          />
        </label>
      </div>
      <h2 className="mt-9 text-4xl leading-tight text-black">{name}</h2>
      <p className="mt-2 text-sm text-[#42251a]">مقاول عام - خبرة {experience} عام</p>
      <p className="mt-3 text-sm text-black"><span className="text-brand-orange">☆ ☆ ☆ ☆ ☆</span> 4.8 (124 تقييم)</p>
      <div className="mt-5 flex justify-center gap-3">
        <button className="grid size-[58px] place-items-center rounded-xl border border-brand-brown text-brand-brown">
          <Share2 className="size-5" />
        </button>
        <button className="inline-flex h-[58px] min-w-[150px] items-center justify-center gap-2 rounded-xl bg-brand-brown px-5 text-lg font-bold text-white">
          <Mail className="size-5" />
          تواصل الآن
        </button>
      </div>
    </article>
  );
}
