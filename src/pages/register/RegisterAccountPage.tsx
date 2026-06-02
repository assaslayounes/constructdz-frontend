import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Lock, Mail, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة السر يجب أن تكون 8 أحرف على الأقل"),
  confirmPassword: z.string().min(8)
}).refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "كلمتا السر غير متطابقتين" });
type Values = z.infer<typeof schema>;

export function RegisterAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });

  function onSubmit(values: Values) {
    navigate("/register/otp", { state: { ...location.state, ...values } });
  }

  return (
    <section className="relative min-h-screen bg-dot pb-24">
      <div className="auth-container pt-2 sm:pt-4">
        <Link to="/register/personal" state={location.state} className="absolute left-5 top-5 sm:left-8 sm:top-7"><ArrowLeft className="size-7 text-brand-brown sm:size-8" /></Link>
        <h1 className="text-center text-4xl font-bold text-brand-brown sm:text-5xl lg:text-6xl">إنجاز 24</h1>
        <div className="mt-14 sm:mt-24"><StepIndicator current={3} labels={["البيانات", "الخطة", "الحساب", "التأكيد"]} /></div>
        <form onSubmit={handleSubmit(onSubmit)} className="soft-card mt-12 px-5 py-8 sm:mt-20 sm:px-10 sm:py-14">
          <h2 className="text-right text-4xl text-black sm:text-5xl">معلومات الحساب</h2>
          <p className="mt-5 text-right text-lg leading-8 sm:mt-7 sm:text-2xl sm:leading-10">يرجى إدخال تفاصيل الدخول الخاصة بك للمتابعة إلى خطوة التأكيد.</p>
          <label className="mt-10 block text-right text-lg sm:mt-14 sm:text-xl">البريد الإلكتروني</label>
          <Input {...register("email")} className="mt-4" icon={<Mail />} placeholder="name@company.com" />
          {errors.email && <p className="mt-2 text-red-600">{errors.email.message}</p>}
          <label className="mt-8 block text-right text-lg sm:mt-10 sm:text-xl">كلمة السر</label>
          <Input {...register("password")} type="password" className="mt-4" icon={<Eye />} placeholder="••••••••" />
          {errors.password && <p className="mt-2 text-red-600">{errors.password.message}</p>}
          <label className="mt-8 block text-right text-lg sm:mt-10 sm:text-xl">تأكيد كلمة السر</label>
          <Input {...register("confirmPassword")} type="password" className="mt-4" icon={<Lock />} placeholder="••••••••" />
          {errors.confirmPassword && <p className="mt-2 text-red-600">{errors.confirmPassword.message}</p>}
          <Button className="mt-10 h-14 w-full rounded-2xl text-lg sm:mt-14 sm:h-[86px] sm:text-2xl">التالي (تأكيد OTP) <ArrowLeft /></Button>
          <Button asChild variant="outline" className="mt-5 h-14 w-full rounded-2xl text-lg sm:mt-7 sm:h-[80px] sm:text-2xl"><Link to="/register/personal" state={location.state}>رجوع</Link></Button>
          <Button asChild variant="outline" className="mt-3 h-14 w-full rounded-2xl text-lg text-red-600 sm:mt-5 sm:h-[80px] sm:text-2xl"><Link to="/login">إلغاء</Link></Button>
        </form>
        <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center text-base text-emerald-900 sm:mt-14 sm:px-8 sm:py-8 sm:text-lg">
          <Shield className="ml-3 inline-block" /> بياناتك مشفرة ومحمية وفق أعلى معايير الأمان الإنشائية.
        </div>
      </div>
    </section>
  );
}
