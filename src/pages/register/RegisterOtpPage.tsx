import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/context/AuthContext";
import { useRegister } from "@/hooks/useAuth";
import type { AccountType } from "@/types/domain";

const otpSchema = z.object({
  code: z.array(z.string().regex(/^\d?$/)).length(6).refine((value) => value.join("").length === 6, "يرجى إدخال رمز مكون من 6 أرقام")
});

type OtpFormValues = z.infer<typeof otpSchema>;

type RegisterState = {
  email?: string;
  password?: string;
  role?: AccountType;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
};

export function RegisterOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registerUser = useRegister();
  const { setAuthUser } = useAuthState();
  const state = (location.state ?? {}) as RegisterState;
  const { control, handleSubmit, formState: { errors } } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: Array(6).fill("") }
  });

  async function onSubmit(values: OtpFormValues) {
    if (!state.email || !state.password || !state.role) {
      toast.error("يرجى إكمال خطوات التسجيل من البداية");
      navigate("/register/type");
      return;
    }

    try {
      const user = await registerUser.mutateAsync({
        email: state.email,
        password: state.password,
        role: state.role,
        firstName: state.firstName,
        lastName: state.lastName,
        name: [state.firstName, state.lastName].filter(Boolean).join(" "),
        phone: state.phone,
        address: state.address,
        otp: values.code.join("")
      });
      setAuthUser(user);
      toast.success("تم إنشاء الحساب بنجاح");
      navigate("/register/success");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إنشاء الحساب");
    }
  }

  return (
    <section className="relative min-h-screen bg-brand-bg pb-24">
      <div className="auth-container pt-2 sm:pt-4">
        <Link to="/register/account" state={state} className="absolute left-5 top-5 sm:left-8 sm:top-7"><ArrowLeft className="size-7 text-brand-brown sm:size-8" /></Link>
        <h1 className="text-center text-4xl font-bold text-brand-brown sm:text-5xl lg:text-6xl">إنجاز 24</h1>
        <div className="mx-auto mt-12 w-fit rounded-full bg-[#ffd9c4] px-6 py-2.5 text-lg text-brand-brown sm:mt-16 sm:px-8 sm:py-3 sm:text-xl">الخطوة 4 من 4</div>
        <div className="mx-auto mt-12 grid size-28 place-items-center rounded-[34px] bg-[#fee5d7] text-brand-brown sm:mt-16 sm:size-36 sm:rounded-[42px]"><ShieldCheck className="size-12 sm:size-16" /></div>
        <h2 className="mt-12 text-center text-4xl text-black sm:mt-16 sm:text-6xl">تأكيد الرمز</h2>
        <p className="mt-5 text-center text-lg leading-8 sm:mt-7 sm:text-2xl sm:leading-10">لقد أرسلنا رمز التحقق المكون من 6 أرقام إلى هاتفك المسجل.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 rounded-[28px] border border-brand-border bg-white px-4 py-8 sm:mt-16 sm:px-11 sm:py-11">
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <div dir="ltr" className="grid grid-cols-6 gap-2 sm:gap-4">
                {field.value.map((value, index) => (
                  <input
                    key={index}
                    value={value}
                    maxLength={1}
                    inputMode="numeric"
                    aria-label={`OTP digit ${index + 1}`}
                    onChange={(event) => {
                      const next = [...field.value];
                      next[index] = event.target.value.replace(/\D/g, "").slice(0, 1);
                      field.onChange(next);
                    }}
                    className="h-14 rounded-xl border-2 border-[#8b6a57] bg-brand-bg text-center text-2xl outline-none focus:border-brand-orange sm:h-[82px] sm:rounded-2xl sm:text-3xl"
                  />
                ))}
              </div>
            )}
          />
          {errors.code && <p className="mt-3 text-center text-sm text-red-600 sm:text-base">{errors.code.message}</p>}
          <Button disabled={registerUser.isPending} className="mt-10 h-14 w-full rounded-full text-lg sm:mt-14 sm:h-[86px] sm:text-2xl">
            {registerUser.isPending ? "جاري إنشاء الحساب..." : "تأكيد الرمز"}
          </Button>
          <Button asChild variant="outline" className="mt-5 h-14 w-full rounded-full text-lg sm:mt-7 sm:h-[76px] sm:text-2xl"><Link to="/register/account" state={state}>الرجوع للخطوة السابقة</Link></Button>
          <Button asChild variant="outline" className="mt-3 h-14 w-full rounded-full text-lg text-red-600 sm:mt-5 sm:h-[76px] sm:text-2xl"><Link to="/login">إلغاء</Link></Button>
          <p className="mt-8 text-center text-base sm:mt-11 sm:text-xl">لم يصلك الرمز؟ <span className="text-slate-400">إعادة الإرسال</span></p>
          <p className="mt-4 text-center text-lg sm:mt-5 sm:text-2xl">يمكنك إعادة الإرسال خلال 00:57</p>
        </form>
        <div className="mx-auto mt-12 flex w-fit items-center gap-3 rounded-full bg-[#89eadb] px-6 py-3 text-lg text-emerald-900 sm:mt-16 sm:px-8 sm:py-4 sm:text-xl"><ShieldCheck /> اتصال آمن ومحمي</div>
      </div>
    </section>
  );
}
