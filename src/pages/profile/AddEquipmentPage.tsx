import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Camera, CheckCircle, ChevronDown, PlusCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProfileShell } from "@/components/profile/ProfileShell";
import { useAuthState } from "@/context/AuthContext";
import { resourcesService } from "@/services/resources.service";

const schema = z.object({
  title: z.string().min(3, "اسم المعدة مطلوب"),
  category: z.string().min(2, "اختر التصنيف"),
  description: z.string().min(8, "أضف وصفاً مختصراً"),
  pricePerDay: z.coerce.number().min(1, "أدخل السعر اليومي"),
  wilaya: z.string().min(2, "اختر الولاية"),
  available: z.boolean()
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

async function filesToDataUrls(files: FileList | null) {
  if (!files) return [];
  return Promise.all(Array.from(files).slice(0, 5).map((file) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  })));
}

export function AddEquipmentPage() {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>([]);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { available: true, category: "", wilaya: "Guelma" }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => resourcesService.createEquipment({
      ownerId: user!.id,
      images,
      createdAt: new Date().toISOString(),
      ...values
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment", user?.id] });
      toast.success("تمت إضافة المعدة");
      navigate("/profile");
    },
    onError: () => toast.error("تعذر إضافة المعدة")
  });

  return (
    <ProfileShell title="إضافة معدة">
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-8 pb-28 text-right">
        <div className="border-t border-brand-border pt-9 text-center">
          <h2 className="text-4xl text-brand-brown">تفاصيل المعدة الجديدة</h2>
          <p className="mt-5 text-base leading-8 text-black">يرجى إدخال كافة المعلومات المطلوبة بدقة لضمان ظهور معدتك بشكل احترافي للمستأجرين.</p>
        </div>

        <label className="grid min-h-[220px] cursor-pointer place-items-center rounded-[20px] border-2 border-dashed border-brand-border bg-white px-6 text-center">
          <span>
            <span className="mx-auto mb-5 grid size-[82px] place-items-center rounded-full bg-[#fff0e8] text-brand-brown"><Camera className="size-10" /></span>
            <strong className="block text-lg">اضغط لرفع الصور، أو اسحبها هنا</strong>
            <span className="mt-2 block text-base">(PNG, JPG) يمكنك رفع حتى 5 صور</span>
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={async (event) => setImages(await filesToDataUrls(event.target.files))}
          />
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((image) => <img key={image} src={image} alt="" className="aspect-square rounded-lg object-cover" />)}
          </div>
        )}

        <section className="space-y-8 rounded-2xl bg-white px-8 py-9 shadow-sm">
          <label className="block">اسم المعدة</label>
          <input {...register("title")} className="h-[62px] w-full rounded-lg border border-brand-border px-5 text-right outline-none" placeholder="مثال: رافعة شوكية هيدروليكية" />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}

          <label className="block">التصنيف</label>
          <div className="relative">
            <select {...register("category")} className="h-[62px] w-full appearance-none rounded-lg border border-brand-border bg-white px-5 text-right outline-none">
              <option value="">اختر التصنيف المناسب</option>
              <option value="Excavator">حفارات</option>
              <option value="Truck">شاحنات</option>
              <option value="Tools">أدوات</option>
            </select>
            <ChevronDown className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2" />
          </div>
          {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
        </section>

        <section className="rounded-2xl bg-white px-8 py-9 shadow-sm">
          <label className="mb-6 block">حالة المعدة</label>
          <Controller
            control={control}
            name="available"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => field.onChange(true)} className={`h-[62px] rounded-lg border border-brand-border ${field.value ? "bg-brand-orange text-white" : "bg-white"}`}>جديدة</button>
                <button type="button" onClick={() => field.onChange(false)} className={`h-[62px] rounded-lg border border-brand-border ${!field.value ? "bg-brand-orange text-white" : "bg-white"}`}>مستعملة</button>
              </div>
            )}
          />
        </section>

        <section className="space-y-6 rounded-2xl bg-white px-8 py-9 shadow-sm">
          <label>سعر الإيجار اليومي</label>
          <div className="flex h-[62px] items-center rounded-lg border border-brand-border px-5">
            <span className="text-brand-brown">د.ج</span>
            <input {...register("pricePerDay")} type="number" className="min-w-0 flex-1 bg-transparent px-5 text-left text-xl text-slate-500 outline-none" placeholder="0.00" />
          </div>
          {errors.pricePerDay && <p className="text-sm text-red-600">{errors.pricePerDay.message}</p>}
          <input {...register("wilaya")} className="h-[62px] w-full rounded-lg border border-brand-border px-5 text-right outline-none" placeholder="الولاية" />
          <textarea {...register("description")} className="min-h-28 w-full rounded-lg border border-brand-border px-5 py-4 text-right outline-none" placeholder="وصف المعدة" />
        </section>

        <section className="flex gap-4 rounded-2xl border border-orange-200 bg-[#ffe9dc] px-6 py-6 text-right">
          <ShieldCheck className="size-8 shrink-0 text-brand-brown" />
          <p><strong className="block text-brand-brown">نصيحة السلامة</strong><span className="mt-2 block leading-8">تأكد من توفر شهادات الفحص الدوري للمعدة لزيادة فرص التأجير.</span></p>
        </section>

        <div className="fixed inset-x-0 bottom-[76px] z-40 border-t border-brand-border bg-white px-6 py-5">
          <Button disabled={mutation.isPending} className="mx-auto flex h-[62px] w-full max-w-[430px] rounded-xl text-3xl text-black">
            <PlusCircle className="size-7" />
            إضافة المعدة
          </Button>
        </div>
      </form>
    </ProfileShell>
  );
}
