import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bolt, Construction, Drill, Hammer, Plus, Search, Truck, UserCog, Wrench } from "lucide-react";
import { CategoryChip } from "@/components/home/CategoryChip";
import { SupplierCard } from "@/components/home/SupplierCard";
import { resourcesService } from "@/services/resources.service";
import type { Equipment, Profile } from "@/types/domain";

const fallbackProfiles: Profile[] = [
  {
    id: "1",
    userId: "1",
    companyName: "مجموعة الجزائر للمقاولات",
    city: "الجزائر العاصمة",
    rating: 4.9,
    reviewsCount: 120,
    services: ["تأجير معدات", "صيانة سريعة"],
    profileImage: "https://images.unsplash.com/photo-1640622300930-6e8daa985739?q=80&w=240&auto=format&fit=crop"
  },
  {
    id: "2",
    userId: "2",
    companyName: "المهندس عثمان للتقنية",
    city: "وهران",
    rating: 4.7,
    reviewsCount: 85,
    services: ["كهرباء صناعية", "متاح حاليا"],
    profileImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=240&auto=format&fit=crop"
  }
];

const fallbackEquipment: Equipment[] = [
  {
    id: "eq_home_1",
    title: "حفارة هيدروليكية",
    category: "معدات",
    description: "حفارة متاحة مع السائق",
    pricePerDay: 25000,
    wilaya: "قالمة",
    images: ["https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=500&auto=format&fit=crop"],
    available: true
  }
];

type FilterMode = "all" | "equipment" | "providers";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<FilterMode>("all");

  const profilesQuery = useQuery({ queryKey: ["profiles"], queryFn: resourcesService.profiles });
  const equipmentQuery = useQuery({ queryKey: ["equipment"], queryFn: resourcesService.equipment });

  const profiles = profilesQuery.data?.length ? profilesQuery.data : fallbackProfiles;
  const equipment = equipmentQuery.data?.length ? equipmentQuery.data : fallbackEquipment;
  const normalizedQuery = query.trim().toLowerCase();

  const filteredProfiles = useMemo(() => profiles.filter((profile) => {
    if (mode === "equipment") return false;
    if (!normalizedQuery) return true;
    return [
      profile.companyName,
      profile.city,
      ...(profile.services ?? [])
    ].join(" ").toLowerCase().includes(normalizedQuery);
  }), [mode, normalizedQuery, profiles]);

  const filteredEquipment = useMemo(() => equipment.filter((item) => {
    if (mode === "providers") return false;
    if (!normalizedQuery) return true;
    return [
      item.title,
      item.name,
      item.category,
      item.description,
      item.wilaya
    ].join(" ").toLowerCase().includes(normalizedQuery);
  }), [equipment, mode, normalizedQuery]);

  return (
    <section className="content-container pt-6 sm:pt-8 lg:pt-10">
        <div className="text-right">
          <h2 className="text-xl text-black sm:text-2xl lg:text-3xl">إبحث عن احتياجاتك</h2>
          <p className="mt-3 text-sm text-brand-ink sm:text-base lg:text-lg">معدات، خدمات، ومحترفين في مكان واحد</p>
        </div>

        <div className="mt-7 flex h-[60px] items-center gap-3 rounded-xl border border-brand-border bg-white px-2 sm:h-[64px] sm:gap-4 lg:max-w-3xl">
          <button className="h-11 shrink-0 rounded-lg bg-brand-brown px-4 text-sm text-white sm:px-5">بحث</button>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-right text-sm outline-none placeholder:text-slate-500 sm:text-base" placeholder="إبحث عن جرافات، كهربائيين، أو معدات..." />
          <Search className="size-6 shrink-0 text-[#8b6a57]" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-brand-border bg-white p-2 text-xs font-bold text-brand-brown sm:max-w-xl sm:text-sm">
          {[
            { id: "all", label: "الكل" },
            { id: "equipment", label: "معدات" },
            { id: "providers", label: "حرفيون" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as FilterMode)}
              className={`h-10 rounded-lg transition ${mode === item.id ? "bg-brand-orange text-white" : "bg-[#fff7f2]"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between sm:mt-12">
          <span className="text-sm text-brand-brown sm:text-base">عرض الكل</span>
          <h2 className="text-lg text-black sm:text-xl lg:text-2xl">الفئات</h2>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
          <CategoryChip label="حفارات" active icon={<Wrench className="size-6 sm:size-7" />} />
          <CategoryChip label="شاحنات" icon={<Truck className="size-6 sm:size-7" />} />
          <CategoryChip label="كهرباء" icon={<Bolt className="size-6 sm:size-7" />} />
          <CategoryChip label="سباكة" icon={<Hammer className="size-6 sm:size-7" />} />
          <CategoryChip label="معدات" icon={<Drill className="size-6 sm:size-7" />} />
        </div>

        <div className="relative mt-10 h-[190px] overflow-hidden rounded-[24px] bg-black shadow-lg sm:mt-12 sm:h-[216px] sm:rounded-[26px] md:h-[260px] lg:h-[320px]">
          <img alt="معدات بناء" src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop" className="h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/65 to-transparent" />
          <div className="absolute right-6 top-12 text-right text-white sm:right-8 sm:top-16 lg:right-12 lg:top-24">
            <h3 className="text-lg font-bold leading-7 sm:text-xl lg:text-3xl lg:leading-10">أفضل المعدات<br />بأسعار تنافسية</h3>
            <button className="mt-3 rounded-full bg-[#b45b00] px-6 py-2.5 text-sm sm:px-7 sm:py-3 lg:text-base">اكتشف الآن</button>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <span className="text-sm text-brand-brown sm:text-base">شاهد الكل</span>
          <h2 className="text-2xl text-black lg:text-3xl">أفضل الموردين</h2>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <SupplierCard
              key={profile.id}
              title={profile.companyName}
              image={profile.profileImage || profile.avatarUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=120&auto=format&fit=crop"}
              rating={profile.rating ?? 4.8}
              reviews={profile.reviewsCount ?? 0}
              tags={profile.services ?? []}
              location={profile.city}
            />
          ))}
          {filteredEquipment.map((item) => (
            <article key={item.id} className="soft-card overflow-hidden">
              <img src={item.images?.[0] || item.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500&auto=format&fit=crop"} alt={item.title || item.name} className="h-40 w-full object-cover" />
              <div className="p-5 text-right">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-brand-orange">{item.category}</span>
                  <h3 className="text-xl font-bold text-black">{item.title || item.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-brand-muted">{item.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm font-bold">
                  <span className="text-brand-brown">{item.pricePerDay?.toLocaleString("ar-DZ")} د.ج/يوم</span>
                  <span>{item.wilaya}</span>
                </div>
              </div>
            </article>
          ))}
          {!filteredProfiles.length && !filteredEquipment.length && (
            <p className="rounded-xl border border-brand-border bg-white p-6 text-center text-brand-muted md:col-span-2 xl:col-span-3">لا توجد نتائج مطابقة</p>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 pb-6 sm:grid-cols-2 md:max-w-3xl lg:max-w-4xl">
          <div className="relative rounded-[24px] bg-[#ffd7bf] p-7 text-center sm:p-8">
            <Construction className="mx-auto mb-6 size-8 sm:mb-7" />
            <p className="text-3xl font-bold text-black">+200</p>
            <p className="mt-3 text-sm text-brand-muted">معدات ثقيلة</p>
            <button className="absolute -bottom-4 left-0 grid size-14 place-items-center rounded-full bg-brand-brown text-white sm:size-16"><Plus className="size-7 sm:size-8" /></button>
          </div>
          <div className="rounded-[24px] bg-[#dedcff] p-7 text-center sm:p-8">
            <UserCog className="mx-auto mb-6 size-8 text-blue-950 sm:mb-7" />
            <p className="text-3xl font-bold text-blue-950">+500</p>
            <p className="mt-3 text-sm text-blue-950/70">عامل مؤهل</p>
          </div>
        </div>
      </section>
  );
}
