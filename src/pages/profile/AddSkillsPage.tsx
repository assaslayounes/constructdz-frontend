import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Hammer, HardHat, Paintbrush, Plug, Save, Search, Snowflake, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProfileShell } from "@/components/profile/ProfileShell";
import { useAuthState } from "@/context/AuthContext";
import { resourcesService } from "@/services/resources.service";
import type { Profile } from "@/types/domain";

const schema = z.object({
  bio: z.string().min(12, "أضف وصفاً مهنياً أوضح"),
  experienceYears: z.coerce.number().min(0, "سنوات الخبرة غير صحيحة")
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const skills = [
  { label: "سباكة", icon: Wrench },
  { label: "كهرباء", icon: Plug },
  { label: "بناء ومحارة", icon: HardHat, wide: true },
  { label: "نجارة", icon: Hammer },
  { label: "دهانات", icon: Paintbrush },
  { label: "تكييف وتبريد", icon: Snowflake },
  { label: "تركيب سيراميك", icon: HardHat },
  { label: "حدادة", icon: Hammer }
];

export function AddSkillsPage() {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => resourcesService.profileByUser(user!.id),
    enabled: Boolean(user?.id)
  });

  const profile = profileQuery.data;
  const visibleSkills = useMemo(() => skills.filter((skill) => skill.label.includes(filter.trim())), [filter]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    values: {
      bio: profile?.bio ?? "متخصص في تنفيذ المشاريع السكنية والتجارية الكبرى مع التركيز على الجودة والدقة.",
      experienceYears: profile?.experienceYears ?? 5
    }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload: Profile = {
        id: profile?.id ?? `pro_${Date.now()}`,
        userId: user!.id,
        companyName: profile?.companyName || user?.name || "مستخدم إنجاز 24",
        city: profile?.city || "قالمة",
        profileImage: profile?.profileImage || user?.avatarUrl,
        services: selected.length ? selected : profile?.services ?? [],
        ...values
      };

      return profile?.id ? resourcesService.updateProfile(profile.id, payload) : resourcesService.createProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("تم حفظ المهارات");
      navigate("/profile");
    },
    onError: () => toast.error("تعذر حفظ المهارات")
  });

  return (
    <ProfileShell title="إنجاز 24">
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-8">
        <div className="text-right">
          <h2 className="text-4xl font-semibold text-black">إضافة مهارات</h2>
          <p className="mt-5 text-base leading-8 text-black">اختر المهارات التي تتقنها ليتمكن العملاء من العثور عليك بسهولة.</p>
        </div>
        <div className="rounded-xl border border-brand-border bg-white px-5 py-5 text-right text-[#8f7667]">
          {selected.length ? selected.join("، ") : "لم يتم اختيار أي مهارات بعد.."}
        </div>
        <label className="flex h-14 items-center gap-3 rounded-xl border border-brand-border bg-[#fff0e8] px-5">
          <Search className="size-6 text-black" />
          <input value={filter} onChange={(event) => setFilter(event.target.value)} className="min-w-0 flex-1 bg-transparent text-right outline-none" placeholder="ابحث عن مهارة (مثلاً: سباكة، نجارة..)" />
        </label>
        <div className="grid grid-cols-2 gap-5">
          {visibleSkills.map(({ label, icon: Icon, wide }) => {
            const active = selected.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSelected((current) => active ? current.filter((item) => item !== label) : [...current, label])}
                className={`min-h-[178px] rounded-[26px] border border-brand-border bg-white px-5 py-9 text-center shadow-sm ${wide ? "col-span-2" : ""} ${active ? "ring-2 ring-brand-orange" : ""}`}
              >
                <span className="mx-auto grid size-[68px] place-items-center rounded-full bg-[#ffe7da] text-brand-brown"><Icon className="size-8" /></span>
                <span className="mt-7 block whitespace-pre-line text-3xl leading-tight text-black">{label}</span>
              </button>
            );
          })}
        </div>
        <div className="grid gap-4 rounded-xl border border-brand-border bg-white p-5 text-right">
          <label>سنوات الخبرة</label>
          <input {...register("experienceYears")} type="number" className="h-14 rounded-xl border border-brand-border px-4 outline-none" />
          {errors.experienceYears && <p className="text-sm text-red-600">{errors.experienceYears.message}</p>}
          <label>نبذة تعريفية</label>
          <textarea {...register("bio")} className="min-h-28 rounded-xl border border-brand-border px-4 py-3 outline-none" />
          {errors.bio && <p className="text-sm text-red-600">{errors.bio.message}</p>}
        </div>
        <div className="fixed inset-x-0 bottom-[76px] z-40 border-t border-brand-border bg-white px-6 py-5">
          <Button disabled={mutation.isPending} className="mx-auto flex h-[60px] w-full max-w-[430px] rounded-xl bg-brand-brown text-base">
            <Save className="size-5" />
            حفظ المهارات
          </Button>
        </div>
      </form>
    </ProfileShell>
  );
}
