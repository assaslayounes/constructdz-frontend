import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Camera, Edit3, Hammer, PlusCircle, ShieldCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileShell } from "@/components/profile/ProfileShell";
import { SectionCard } from "@/components/profile/SectionCard";
import { useAuthState } from "@/context/AuthContext";
import { resourcesService } from "@/services/resources.service";
import type { Equipment, Profile, Project } from "@/types/domain";

const projectSchema = z.object({
  title: z.string().min(3, "عنوان المشروع مطلوب"),
  description: z.string().min(10, "الوصف قصير"),
  wilaya: z.string().min(2, "اختر الولاية"),
  landType: z.string().min(2, "اختر نوع الأرض"),
  budget: z.coerce.number().min(1, "الميزانية مطلوبة")
});

type ProjectFormInput = z.input<typeof projectSchema>;
type ProjectForm = z.output<typeof projectSchema>;

const fallbackProfile: Profile = {
  id: "pro_fallback",
  userId: "usr_002",
  companyName: "أحمد المنصوري",
  city: "قالمة",
  bio: "متخصص في تنفيذ المشاريع السكنية والتجارية الكبرى مع التركيز على معايير الجودة العالمية والجداول الزمنية الدقيقة.",
  experienceYears: 15,
  services: ["إدارة المشاريع", "الخرسانة المسلحة", "التشطيبات النهائية", "تخطيط المواقع", "أنظمة السلامة", "التسعير والتقدير"],
  profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=240&auto=format&fit=crop",
  rating: 4.8,
  reviewsCount: 124
};

const fallbackEquipment: Equipment[] = [
  {
    id: "eq_demo_1",
    ownerId: "usr_002",
    title: "حفارة هيدروليكية",
    category: "Excavator",
    description: "جاهزة للعمل اليومي مع مشغل",
    pricePerDay: 25000,
    wilaya: "Guelma",
    images: ["https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=500&auto=format&fit=crop"],
    available: true
  },
  {
    id: "eq_demo_2",
    ownerId: "usr_002",
    title: "أجهزة قياس دقيقة",
    category: "Tools",
    description: "معدات قياس وتسوية للمواقع",
    pricePerDay: 6000,
    wilaya: "Guelma",
    images: ["https://images.unsplash.com/photo-1581092160607-ee22731c31fb?q=80&w=500&auto=format&fit=crop"],
    available: true
  }
];

export function ProfilePage() {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const role = user?.role ?? "provider";
  const isServiceProvider = role === "provider" || role === "service_provider";
  const isEquipmentOwner = role === "equipment_owner";
  const isProjectOwner = role === "owner" || role === "project_owner";

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => resourcesService.profileByUser(user!.id),
    enabled: Boolean(user?.id)
  });

  const equipmentQuery = useQuery({
    queryKey: ["equipment", user?.id],
    queryFn: () => resourcesService.equipmentByOwner(user!.id),
    enabled: Boolean(user?.id && (isServiceProvider || isEquipmentOwner))
  });

  const projectsQuery = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: () => resourcesService.projectsByClient(user!.id),
    enabled: Boolean(user?.id && isProjectOwner)
  });

  const profile = profileQuery.data ?? fallbackProfile;
  const equipment = equipmentQuery.data?.length ? equipmentQuery.data : fallbackEquipment;
  const projects = projectsQuery.data ?? [];

  if (!user) return null;
  const currentUser = user;

  async function handleProfileImage(file: File) {
    const image = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });

    const payload: Profile = {
      ...profile,
      id: profileQuery.data?.id ?? `pro_${Date.now()}`,
      userId: currentUser.id,
      companyName: profile.companyName || currentUser.name || "مستخدم إنجاز 24",
      city: profile.city || "قالمة",
      profileImage: image
    };

    try {
      if (profileQuery.data?.id) {
        await resourcesService.updateProfile(profileQuery.data.id, payload);
      } else {
        await resourcesService.createProfile(payload);
      }
      queryClient.invalidateQueries({ queryKey: ["profile", currentUser.id] });
      toast.success("تم تحديث صورة الملف");
    } catch {
      toast.error("تعذر تحديث الصورة");
    }
  }

  return (
    <ProfileShell title="الملف الشخصي">
      <div className="space-y-7">
        <ProfileCard user={user} profile={profile} onImageChange={handleProfileImage} />
        {(isServiceProvider || isEquipmentOwner) && (
          <>
            <SkillsSection profile={profile} />
            <EquipmentSection equipment={equipment} showAdd={isEquipmentOwner || isServiceProvider} />
            <StatsSection />
          </>
        )}
        {isProjectOwner && (
          <ProjectOwnerSection
            projects={projects}
            onSaved={() => {
              queryClient.invalidateQueries({ queryKey: ["projects", user.id] });
            }}
          />
        )}
      </div>
    </ProfileShell>
  );
}

function SkillsSection({ profile }: { profile: Profile }) {
  return (
    <SectionCard
      title="المهارات والخبرات"
      icon={<Wrench className="size-5" />}
      action={<Link to="/profile/skills" className="inline-flex items-center gap-1 text-sm">إضافة <PlusCircle className="size-4" /></Link>}
    >
      <div className="flex flex-wrap justify-center gap-3">
        {(profile.services ?? []).map((service) => (
          <span key={service} className="rounded-full border border-brand-border bg-[#ffe7da] px-5 py-2 text-sm text-[#5a2d1b]">{service}</span>
        ))}
      </div>
      <p className="mx-auto mt-7 max-w-[330px] rounded-lg border border-brand-border bg-[#fffaf5] px-5 py-5 text-center text-sm leading-8 text-[#2b1d16]">
        {profile.bio}
      </p>
    </SectionCard>
  );
}

function EquipmentSection({ equipment, showAdd }: { equipment: Equipment[]; showAdd: boolean }) {
  return (
    <SectionCard
      title="المعدات والأدوات"
      icon={<Hammer className="size-5" />}
      action={showAdd ? <Link to="/profile/equipment/new" className="inline-flex items-center gap-1 text-sm">تعديل <Edit3 className="size-4" /></Link> : null}
    >
      <div className="grid grid-cols-2 gap-4">
        {equipment.slice(0, 3).map((item) => (
          <article key={item.id} className="relative aspect-square overflow-hidden rounded-lg bg-black">
            <img src={item.images?.[0] || item.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500&auto=format&fit=crop"} alt={item.title || item.name} className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-3 text-right text-xs font-bold text-white">
              {item.title || item.name}
            </div>
          </article>
        ))}
        {showAdd && (
          <Link to="/profile/equipment/new" className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-brand-border text-center text-brand-brown">
            <span><Camera className="mx-auto mb-2 size-7" />إضافة معدات</span>
          </Link>
        )}
      </div>
    </SectionCard>
  );
}

function StatsSection() {
  return (
    <>
      <section className="flex items-center gap-5 rounded-lg border border-[#c9c0ff] bg-[#ece8ff] px-6 py-7 text-right text-[#17258b]">
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[#959bff]"><ShieldCheck className="size-8" /></div>
        <div>
          <h2 className="text-3xl">سجل أمان متميز</h2>
          <p className="mt-2 text-sm leading-7">لم يتم تسجيل أي حوادث في آخر 12 مشروعاً تم تنفيذها بنجاح.</p>
        </div>
      </section>
      <section className="grid grid-cols-3 rounded-lg border border-brand-border bg-[#ffe9dc] py-6 text-center text-brand-brown">
        <div><p className="text-3xl">+85</p><p className="mt-1 text-xs text-black">مشروع مكتمل</p></div>
        <div className="border-x border-brand-border"><p className="text-3xl">98%</p><p className="mt-1 text-xs text-black">رضا العملاء</p></div>
        <div><p className="text-3xl">4</p><p className="mt-1 text-xs text-black">فرق عمل</p></div>
      </section>
    </>
  );
}

function ProjectOwnerSection({ projects, onSaved }: { projects: Project[]; onSaved: () => void }) {
  const { user } = useAuthState();
  const mutation = useMutation({
    mutationFn: (values: ProjectForm) => resourcesService.createProject({
      clientId: user!.id,
      ownerId: user!.id,
      location: values.wilaya,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...values
    }),
    onSuccess: () => {
      toast.success("تم حفظ المشروع");
      onSaved();
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormInput, unknown, ProjectForm>({ resolver: zodResolver(projectSchema) });
  const latest = useMemo(() => projects[0], [projects]);

  return (
    <SectionCard title="مشاريعي" icon={<Hammer className="size-5" />}>
      {latest && <p className="mb-5 rounded-full bg-[#ffe7da] px-4 py-2 text-center text-sm text-brand-brown">الحالة: {latest.status}</p>}
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4 text-right">
        <Input {...register("title")} placeholder="عنوان المشروع" />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        <textarea {...register("description")} placeholder="وصف المشروع" className="min-h-28 w-full rounded-2xl border border-brand-border bg-white/60 px-4 py-3 text-right outline-none" />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        <select {...register("wilaya")} className="h-14 w-full rounded-2xl border border-brand-border bg-white px-4">
          <option value="">اختر الولاية</option>
          <option value="Guelma">قالمة</option>
          <option value="Alger">الجزائر</option>
          <option value="Oran">وهران</option>
        </select>
        {errors.wilaya && <p className="text-sm text-red-600">{errors.wilaya.message}</p>}
        <select {...register("landType")} className="h-14 w-full rounded-2xl border border-brand-border bg-white px-4">
          <option value="">نوع الأرض</option>
          <option value="Rocky">صخرية</option>
          <option value="Clay">طينية</option>
          <option value="Sandy">رملية</option>
        </select>
        <Input {...register("budget")} type="number" placeholder="الميزانية" />
        {errors.budget && <p className="text-sm text-red-600">{errors.budget.message}</p>}
        <Button disabled={mutation.isPending} className="w-full bg-brand-brown">حفظ المشروع</Button>
      </form>
    </SectionCard>
  );
}
