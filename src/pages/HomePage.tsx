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
      <div className="text-right">
        <h1 className="text-2xl font-extrabold leading-snug text-neutral-900 sm:text-3xl lg:text-4xl">
          إبحث عن احتياجاتك
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500 sm:mt-2 sm:text-base lg:text-lg">
          معدات، خدمات، ومحترفين في مكان واحد
        </p>
      </div>

      {/* ── Search bar ───────────────────────────────────────── */}
      <div className="mt-4 sm:mt-6 lg:max-w-3xl">
        <div className="flex h-12 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 shadow-sm transition-shadow focus-within:border-amber-400 focus-within:shadow-[0_0_0_3px_rgba(251,191,36,0.12)] sm:h-14 sm:px-4">
          <Search className="size-4 shrink-0 text-neutral-400 sm:size-5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-right text-sm text-neutral-800 outline-none placeholder:text-neutral-400 sm:text-base"
            placeholder="إبحث عن جرافات، كهربائيين، أو معدات..."
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="shrink-0 text-xs text-neutral-400 hover:text-neutral-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Filter pills ─────────────────────────────────────── */}
      <div className="mt-3 flex gap-2 sm:mt-4 sm:max-w-xs">
        {filterOptions.map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all duration-150 sm:py-2.5 sm:text-sm ${
              mode === item.id
                ? "bg-amber-500 text-white shadow-sm"
                : "border border-neutral-200 bg-white text-neutral-600 hover:border-amber-300 hover:text-amber-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Categories ───────────────────────────────────────── */}
      <div className="mt-8 sm:mt-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-600 sm:text-sm">
            عرض الكل
          </span>
          <h2 className="text-base font-extrabold text-neutral-900 sm:text-lg lg:text-xl">
            الفئات
          </h2>
        </div>
        {/* Horizontal scroll on mobile, grid on wider screens */}
        <div className="hide-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0 sm:gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
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
      <div className="relative mt-8 h-[160px] overflow-hidden rounded-2xl bg-black shadow-md sm:mt-10 sm:h-[210px] md:h-[260px] lg:h-[300px]">
        <img
          alt="معدات بناء"
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop"
          className="h-full w-full object-cover opacity-75"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent" />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-right text-white sm:right-8 lg:right-12">
          <h3 className="text-base font-bold leading-snug sm:text-xl lg:text-3xl">
            أفضل المعدات
            <br />
            بأسعار تنافسية
          </h3>
          <button className="mt-3 rounded-full bg-amber-500 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-600 sm:px-6 sm:py-2.5 sm:text-sm">
            اكتشف الآن
          </button>
        </div>
      </div>

      {/* ── Suppliers / Equipment grid ────────────────────────── */}
      <div className="mt-8 sm:mt-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-600 sm:text-sm">
            شاهد الكل
          </span>
          <h2 className="text-base font-extrabold text-neutral-900 sm:text-lg lg:text-2xl">
            أفضل الموردين
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
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
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-36 sm:h-44">
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
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-amber-700 shadow-sm backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-4 text-right sm:p-5">
                <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                  {item.title || item.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-neutral-500 sm:text-sm">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm font-bold">
                  <span className="text-neutral-500 text-xs sm:text-sm">{item.wilaya}</span>
                  <span className="text-amber-700">
                    {item.pricePerDay?.toLocaleString("ar-DZ")} د.ج/يوم
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
      <div className="mt-8 grid grid-cols-2 gap-3 pb-6 sm:mt-10 sm:gap-4 md:max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl bg-amber-50 p-5 text-center sm:p-7">
          <Construction className="mx-auto mb-3 size-7 text-amber-700 sm:mb-4 sm:size-8" />
          <p className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">+200</p>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">معدات ثقيلة</p>
          <button className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white shadow sm:bottom-4 sm:left-4 sm:h-12 sm:w-12">
            <Plus className="size-5 sm:size-6" />
          </button>
        </div>
        <div className="rounded-2xl bg-indigo-50 p-5 text-center sm:p-7">
          <UserCog className="mx-auto mb-3 size-7 text-indigo-700 sm:mb-4 sm:size-8" />
          <p className="text-2xl font-extrabold text-indigo-900 sm:text-3xl">+500</p>
          <p className="mt-1 text-xs text-indigo-700/70 sm:text-sm">عامل مؤهل</p>
        </div>
      </div>
    </section>
  );
}
