import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bolt,
  Construction,
  Drill,
  Hammer,
  Plus,
  Search,
  Truck,
  UserCog,
  Wrench,
} from "lucide-react";
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
    profileImage:
      "https://images.unsplash.com/photo-1640622300930-6e8daa985739?q=80&w=240&auto=format&fit=crop",
  },
  {
    id: "2",
    userId: "2",
    companyName: "المهندس عثمان للتقنية",
    city: "وهران",
    rating: 4.7,
    reviewsCount: 85,
    services: ["كهرباء صناعية", "متاح حاليا"],
    profileImage:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=240&auto=format&fit=crop",
  },
];

const fallbackEquipment: Equipment[] = [
  {
    id: "eq_home_1",
    title: "حفارة هيدروليكية",
    category: "معدات",
    description: "حفارة متاحة مع السائق",
    pricePerDay: 25000,
    wilaya: "قالمة",
    images: [
      "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=500&auto=format&fit=crop",
    ],
    available: true,
  },
];

type FilterMode = "all" | "equipment" | "providers";

const filterOptions: { id: FilterMode; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "equipment", label: "معدات" },
  { id: "providers", label: "حرفيون" },
];

export function HomePage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<FilterMode>("all");

  const profilesQuery = useQuery({
    queryKey: ["profiles"],
    queryFn: resourcesService.profiles,
  });
  const equipmentQuery = useQuery({
    queryKey: ["equipment"],
    queryFn: resourcesService.equipment,
  });

  const profiles = profilesQuery.data?.length
    ? profilesQuery.data
    : fallbackProfiles;
  const equipment = equipmentQuery.data?.length
    ? equipmentQuery.data
    : fallbackEquipment;
  const normalizedQuery = query.trim().toLowerCase();

  const filteredProfiles = useMemo(
    () =>
      profiles.filter((profile) => {
        if (mode === "equipment") return false;
        if (!normalizedQuery) return true;
        return [profile.companyName, profile.city, ...(profile.services ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      }),
    [mode, normalizedQuery, profiles]
  );

  const filteredEquipment = useMemo(
    () =>
      equipment.filter((item) => {
        if (mode === "providers") return false;
        if (!normalizedQuery) return true;
        return [item.title, item.name, item.category, item.description, item.wilaya]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      }),
    [equipment, mode, normalizedQuery]
  );

  return (
    <section className="content-container pt-5 sm:pt-8 lg:pt-10">

      {/* ── Hero heading ─────────────────────────────────────── */}
      <div className="text-right px-1 sm:px-0">
        <h1 className="text-3xl sm:text-2xl font-black sm:font-extrabold leading-tight sm:leading-snug text-neutral-900 lg:text-4xl">
          إبحث عن احتياجاتك
        </h1>
        <p className="mt-2 sm:mt-1.5 text-[15px] sm:text-sm text-neutral-500 sm:text-base lg:text-lg">
          معدات، خدمات، ومحترفين في مكان واحد
        </p>
      </div>

      {/* ── Search bar ───────────────────────────────────────── */}
      <div className="mt-5 sm:mt-6 lg:max-w-3xl">
        <div className="flex h-14 items-center gap-3 rounded-[1.25rem] border-0 sm:border bg-neutral-100 sm:bg-white px-4 shadow-inner sm:shadow-sm transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-400 sm:focus-within:ring-0 sm:focus-within:border-amber-400 sm:focus-within:shadow-[0_0_0_3px_rgba(251,191,36,0.12)]">
          <Search className="size-5 shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-right text-[15px] sm:text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            placeholder="إبحث عن جرافات، كهربائيين، أو معدات..."
          />
          {query && (
            <button
               onClick={() => setQuery("")}
               className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs text-neutral-600 transition-colors hover:bg-neutral-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Filter pills ─────────────────────────────────────── */}
      <div className="mt-4 flex gap-1.5 rounded-2xl bg-neutral-100/80 p-1 sm:bg-transparent sm:p-0 sm:gap-2 sm:max-w-xs">
        {filterOptions.map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`flex-1 rounded-xl py-2.5 text-[13px] sm:text-xs font-bold transition-all duration-200 sm:py-2.5 sm:text-sm ${
              mode === item.id
                ? "bg-white sm:bg-amber-500 text-amber-700 sm:text-white shadow-sm"
                : "text-neutral-500 sm:border sm:border-neutral-200 sm:bg-white sm:text-neutral-600 sm:hover:border-amber-300 sm:hover:text-amber-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Categories ───────────────────────────────────────── */}
      <div className="mt-8 sm:mt-10">
        <div className="mb-4 flex items-center justify-between px-1 sm:px-0">
          <span className="text-sm sm:text-xs font-bold sm:font-semibold text-amber-600 sm:text-amber-600">
            عرض الكل
          </span>
          <h2 className="text-[19px] font-black sm:font-extrabold text-neutral-900 sm:text-lg lg:text-xl">
            الفئات
          </h2>
        </div>
        {/* Horizontal scroll on mobile, grid on wider screens */}
        <div className="hide-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0 sm:gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
          {[
            { label: "حفارات", icon: <Wrench className="size-5 sm:size-6" />, active: true },
            { label: "شاحنات", icon: <Truck className="size-5 sm:size-6" /> },
            { label: "كهرباء", icon: <Bolt className="size-5 sm:size-6" /> },
            { label: "سباكة", icon: <Hammer className="size-5 sm:size-6" /> },
            { label: "معدات", icon: <Drill className="size-5 sm:size-6" /> },
          ].map((chip) => (
            <div key={chip.label} className="shrink-0 sm:shrink">
              <CategoryChip
                label={chip.label}
                icon={chip.icon}
                active={chip.active}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero banner ──────────────────────────────────────── */}
      <div className="relative mt-10 sm:mt-10 h-[180px] sm:h-[210px] md:h-[260px] lg:h-[300px] overflow-hidden rounded-[1.5rem] bg-black shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <img
          alt="معدات بناء"
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop"
          className="h-full w-full object-cover opacity-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-right text-white sm:right-8 lg:right-12">
          <h3 className="text-xl sm:text-base font-black sm:font-bold leading-tight sm:leading-snug lg:text-3xl">
            أفضل المعدات
            <br />
            بأسعار تنافسية
          </h3>
          <button className="mt-4 sm:mt-3 rounded-full bg-amber-500 px-6 sm:px-5 py-2.5 sm:py-2 text-[13px] sm:text-xs font-bold text-white transition-colors hover:bg-amber-600 active:scale-95 sm:sm:px-6 sm:sm:py-2.5 sm:sm:text-sm">
            اكتشف الآن
          </button>
        </div>
      </div>

      {/* ── Suppliers / Equipment grid ────────────────────────── */}
      <div className="mt-10 sm:mt-10">
        <div className="mb-4 flex items-center justify-between px-1 sm:px-0">
          <span className="text-sm sm:text-xs font-bold sm:font-semibold text-amber-600 sm:text-sm">
            شاهد الكل
          </span>
          <h2 className="text-[19px] sm:text-base font-black sm:font-extrabold text-neutral-900 sm:text-lg lg:text-2xl">
            أفضل الموردين
          </h2>
        </div>

        <div className="grid gap-5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <SupplierCard
              key={profile.id}
              title={profile.companyName}
              image={
                profile.profileImage ||
                profile.avatarUrl ||
                "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=120&auto=format&fit=crop"
              }
              rating={profile.rating ?? 4.8}
              reviews={profile.reviewsCount ?? 0}
              tags={profile.services ?? []}
              location={profile.city}
            />
          ))}

          {filteredEquipment.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl sm:rounded-2xl border border-neutral-100 sm:border-neutral-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 sm:h-36 lg:h-44">
                <img
                  src={
                    item.images?.[0] ||
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500&auto=format&fit=crop"
                  }
                  alt={item.title || item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[12px] sm:text-[11px] font-black sm:font-bold text-amber-700 shadow-sm backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              <div className="p-5 sm:p-4 lg:p-5 text-right">
                <h3 className="text-lg sm:text-base font-black sm:font-bold text-neutral-900 lg:text-lg">
                  {item.title || item.name}
                </h3>
                <p className="mt-2 sm:mt-1.5 line-clamp-2 text-[13px] sm:text-xs leading-relaxed sm:leading-6 text-neutral-500 sm:text-sm">
                  {item.description}
                </p>
                <div className="mt-4 sm:mt-3 flex items-center justify-between text-[15px] sm:text-sm font-black sm:font-bold">
                  <span className="text-neutral-500 text-[13px] sm:text-xs lg:text-sm">{item.wilaya}</span>
                  <span className="text-amber-700">
                    {item.pricePerDay?.toLocaleString("ar-DZ")} د.ج<span className="text-[11px] text-amber-600/70">/يوم</span>
                  </span>
                </div>
              </div>
            </article>
          ))}

          {!filteredProfiles.length && !filteredEquipment.length && (
            <p className="col-span-full rounded-2xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
              لا توجد نتائج مطابقة
            </p>
          )}
        </div>
      </div>

      {/* ── Stats section ────────────────────────────────────── */}
      <div className="mt-10 grid grid-cols-2 gap-4 pb-8 sm:mt-10 sm:gap-4 md:max-w-2xl">
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-2xl bg-amber-50 p-6 sm:p-5 text-center sm:p-7">
          <Construction className="mx-auto mb-4 size-8 sm:mb-3 sm:size-7 text-amber-600 sm:text-amber-700 lg:mb-4 lg:size-8" />
          <p className="text-3xl font-black sm:font-extrabold text-neutral-900 sm:text-2xl lg:text-3xl">+200</p>
          <p className="mt-1.5 sm:mt-1 text-[13px] sm:text-xs font-bold sm:font-normal text-neutral-500 sm:text-sm">معدات ثقيلة</p>
          <button className="absolute bottom-4 left-4 flex h-12 w-12 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-amber-500 sm:bg-amber-600 text-white shadow-md sm:shadow sm:bottom-4 sm:left-4 lg:h-12 lg:w-12 hover:bg-amber-600 active:scale-95 transition-transform">
            <Plus className="size-6 sm:size-5 lg:size-6" />
          </button>
        </div>
        <div className="rounded-[1.5rem] sm:rounded-2xl bg-indigo-50 p-6 sm:p-5 text-center sm:p-7">
          <UserCog className="mx-auto mb-4 size-8 sm:mb-3 sm:size-7 text-indigo-600 sm:text-indigo-700 lg:mb-4 lg:size-8" />
          <p className="text-3xl font-black sm:font-extrabold text-indigo-900 sm:text-2xl lg:text-3xl">+500</p>
          <p className="mt-1.5 sm:mt-1 text-[13px] sm:text-xs font-bold sm:font-normal text-indigo-700/70 sm:text-sm">عامل مؤهل</p>
        </div>
      </div>
    </section>
  );
}
