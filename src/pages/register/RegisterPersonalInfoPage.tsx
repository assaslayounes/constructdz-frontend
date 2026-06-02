import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Headphones, HelpCircle, IdCard, MapPin, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  firstName: z.string().min(2, "يرجى إدخال الاسم"),
  lastName: z.string().min(2, "يرجى إدخال اللقب"),
  phone: z.string().regex(/^5\d{8}$/, "رقم الهاتف يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"),
  address: z.string().min(8, "يرجى إدخال عنوان الإقامة")
});

type FormValues = z.infer<typeof schema>;

const steps = [
  { number: 1, label: "المعلومات" },
  { number: 2, label: "التحقق" },
  { number: 3, label: "الحساب" },
  { number: 4, label: "الانتهاء" }
];

export function RegisterPersonalInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state ?? {};
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: ""
    }
  });

  function onSubmit(values: FormValues) {
    navigate("/register/account", { state: { ...state, ...values, phone: `+966${values.phone}` } });
  }

  return (
    <section className="relative min-h-screen bg-[#fff7f2] pb-[96px]">
      <div className="mx-auto w-full max-w-[430px] px-6 pt-3 sm:max-w-[560px] md:max-w-[620px]">
        <header className="relative flex min-h-[58px] items-start justify-center">
          <Link to="/register/type" state={state} aria-label="رجوع" className="absolute right-0 top-2 text-[#3b2419]">
            <ArrowLeft className="size-8" />
          </Link>
          <h1 className="text-center text-[42px] font-semibold leading-none text-brand-brown">إنجاز 24</h1>
        </header>

        <RegisterProgress />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 rounded-[26px] border border-brand-border/55 bg-white px-8 pb-8 pt-7 shadow-[0_18px_35px_rgba(67,35,18,.08)] sm:px-10">
          <p className="text-center text-sm font-bold text-brand-brown">الخطوة 2 من 4</p>
          <h2 className="mt-5 text-center text-[42px] font-semibold leading-tight text-black sm:text-5xl">معلومات التحقق</h2>
          <p className="mt-5 text-center text-lg leading-8 text-[#2b1d16]">يرجى استكمال بيانات التواصل الخاصة بك</p>

          <div className="mt-14 space-y-9 text-right">
            <FieldLabel label="الاسم" />
            <FieldShell icon={<User />}>
              <input {...register("firstName")} className="h-full min-w-0 flex-1 bg-transparent text-right text-lg outline-none placeholder:text-[#987866]" placeholder="أدخل اسمك الأول" />
            </FieldShell>
            {errors.firstName && <ErrorMessage message={errors.firstName.message} />}

            <FieldLabel label="اللقب" />
            <FieldShell icon={<IdCard />}>
              <input {...register("lastName")} className="h-full min-w-0 flex-1 bg-transparent text-right text-lg outline-none placeholder:text-[#987866]" placeholder="أدخل لقبك" />
            </FieldShell>
            {errors.lastName && <ErrorMessage message={errors.lastName.message} />}

            <FieldLabel label="رقم الهاتف" />
            <div className="flex h-[66px] items-center rounded-[14px] border border-brand-border bg-white px-5 text-[#7f6253]">
              <Phone className="size-7 shrink-0" />
              <input {...register("phone")} inputMode="numeric" className="h-full min-w-0 flex-1 bg-transparent px-5 text-left text-lg outline-none placeholder:text-[#987866]" placeholder="5X XXX XXXX" />
              <span className="h-8 w-px bg-brand-border" />
              <span className="pl-5 text-xl text-[#3b2419]">966+</span>
            </div>
            {errors.phone && <ErrorMessage message={errors.phone.message} />}

            <FieldLabel label="عنوان الإقامة" />
            <div className="flex min-h-[118px] items-start rounded-[14px] border border-brand-border bg-white px-5 py-5 text-[#7f6253]">
              <MapPin className="mt-1 size-7 shrink-0" />
              <textarea {...register("address")} className="min-h-[80px] min-w-0 flex-1 resize-none bg-transparent text-right text-lg outline-none placeholder:text-[#987866]" placeholder="أدخل عنوان السكن الكامل" />
            </div>
            {errors.address && <ErrorMessage message={errors.address.message} />}
          </div>

          <Button className="mt-14 h-[68px] w-full rounded-full bg-brand-orange text-xl font-bold text-black shadow-[0_18px_30px_rgba(255,122,0,.22)]">
            التالي (معلومات الحساب)
            <ArrowLeft className="size-7" />
          </Button>
          <Button asChild variant="outline" className="mt-4 h-[68px] w-full rounded-full text-xl font-bold text-red-600">
            <Link to="/login">إلغاء</Link>
          </Button>
        </form>

        <div className="mt-16 h-[176px] overflow-hidden rounded-[26px] bg-[#d9d3cf]">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-45 grayscale"
          />
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-50 border border-brand-border bg-[#fff0e8]">
        <div className="mx-auto grid h-[78px] w-full max-w-[430px] grid-cols-2 items-center text-center text-sm font-semibold text-[#3b2419]">
          <Link to="#" className="flex flex-col items-center justify-center">
            <Headphones className="mb-1 size-7" />
            الدعم
          </Link>
          <Link to="#" className="flex flex-col items-center justify-center">
            <HelpCircle className="mb-1 size-7" />
            مساعدة
          </Link>
        </div>
      </footer>
    </section>
  );
}

function RegisterProgress() {
  return (
    <div className="mt-12 flex items-start justify-between gap-3 px-5">
      {steps.map((step, index) => {
        const active = step.number === 2;
        const done = step.number === 1;

        return (
          <div key={step.number} className="flex flex-1 items-start last:flex-none">
            <div className="flex min-w-[54px] flex-col items-center">
              <span className={`grid size-[58px] place-items-center rounded-full text-xl font-bold ${active ? "bg-brand-orange text-brand-brown" : done ? "bg-[#e8d6ca] text-[#8b7569]" : "bg-[#f5e9e2] text-[#b4a49a]"}`}>
                {step.number}
              </span>
              <span className={`mt-3 text-sm ${active ? "text-brand-brown" : "text-[#8b7569]"}`}>{step.label}</span>
            </div>
            {index < steps.length - 1 && <span className={`mx-2 mt-7 h-px flex-1 ${step.number <= 2 ? "bg-brand-orange" : "bg-brand-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <label className="-mb-5 block pr-1 text-base font-semibold text-[#2b1d16]">{label}</label>;
}

function FieldShell({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-[66px] items-center rounded-[14px] border border-brand-border bg-white px-5 text-[#7f6253]">
      <span className="[&_svg]:size-7">{icon}</span>
      {children}
    </div>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  return <p className="-mt-6 text-sm text-red-600">{message}</p>;
}
