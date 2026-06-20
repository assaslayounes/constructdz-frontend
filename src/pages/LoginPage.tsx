import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthState } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useAuth";
import { HelpDialog } from "@/components/common/HelpDialog";

const schema = z.object({
  identifier: z.string().min(3, "يرجى إدخال بريد أو رقم صحيح"),
  password: z.string().min(6, "كلمة المرور قصيرة")
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const { setAuthUser } = useAuthState();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const user = await login.mutateAsync(values);
      setAuthUser(user);
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تسجيل الدخول");
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#fff7f2] text-[#4a2d20]">
      {/* Help Button */}
      <div className="absolute left-5 top-5 z-20 sm:left-7 sm:top-7">
        <HelpDialog variant="auth" />
      </div>

      <AuthBrand />

      <main className="relative z-10 flex flex-col items-center px-5 pb-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="-mt-10 w-full max-w-[560px] rounded-[20px] border border-[#e7bfa8] bg-white px-10 pb-10 pt-11 shadow-[0_4px_16px_rgba(104,68,49,0.12)] sm:px-10 sm:py-12"
        >
          <h2 className="mb-10 text-center text-[42px] font-light leading-none text-[#684431] sm:mb-8 sm:text-4xl">
            تسجيل الدخول
          </h2>

          <label className="mb-4 block text-right text-[24px] font-normal leading-none text-[#4a2d20] sm:mb-3 sm:text-lg">
            البريد الإلكتروني أو رقم الهاتف
          </label>
          <Input
            {...register("identifier")}
            icon={<Mail className="size-8 text-[#8b6d5c]" />}
            placeholder="example@mail.com"
            className="h-20 rounded-xl border-[#e3bda6] bg-[#fffaf7] px-6 text-center text-[28px] text-slate-500 placeholder:text-slate-500 focus-visible:ring-brand-blue/30 sm:h-14 sm:text-xl"
          />
          {errors.identifier && <p className="mt-2 text-sm text-red-600">{errors.identifier.message}</p>}

          <div className="mb-4 mt-11 flex items-center justify-between text-[21px] sm:mt-6 sm:text-base">
            <a className="font-normal text-brand-blue underline-offset-4 hover:underline" href="#">
              نسيت كلمة المرور؟
            </a>
            <label className="text-[#4a2d20]">كلمة المرور</label>
          </div>
          <Input
            {...register("password")}
            type="password"
            icon={<Lock className="size-8 text-[#8b6d5c]" />}
            placeholder="••••••••"
            className="h-20 rounded-xl border-[#e3bda6] bg-[#fffaf7] px-6 text-center text-[28px] tracking-[0.35em] text-slate-500 placeholder:text-slate-500 focus-visible:ring-brand-blue/30 sm:h-14 sm:text-xl"
          />
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}

          <Button
            disabled={login.isPending}
            className="mt-10 h-[78px] w-full rounded-xl bg-[#ff7a00] text-[28px] font-medium text-white shadow-[0_8px_14px_rgba(255,122,0,0.28)] transition-all hover:bg-[#f06f00] sm:mt-8 sm:h-14 sm:text-xl"
          >
            {login.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>

          <p className="mt-14 text-center text-[22px] text-[#4a2d20] sm:mt-8 sm:text-base">
            ليس لديك حساب؟
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-8 h-[78px] w-full rounded-xl border-brand-blue bg-white text-[28px] font-medium text-brand-blue hover:bg-brand-blue/5 sm:mt-4 sm:h-14 sm:text-xl"
          >
            <Link to="/register/type">إنشاء حساب جديد</Link>
          </Button>
        </form>

        <div className="mt-20 flex w-full max-w-[560px] items-center gap-5 rounded-[18px] border border-[#f0dfd6] bg-white/80 px-7 py-7 text-right shadow-[0_2px_8px_rgba(104,68,49,0.04)] sm:mt-12 sm:gap-5 sm:px-6 sm:py-5">
          <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-[#9aa0ff] text-blue-950 sm:size-14">
            <ShieldCheck className="size-9 sm:size-7" />
          </div>
          <div>
            <h3 className="text-[27px] font-normal leading-tight text-[#2f2119] sm:text-lg">
              آمن ومعتمد
            </h3>
            <p className="mt-3 text-[18px] leading-8 text-[#2f2119] sm:text-base sm:leading-6">
              بيانات مشاريعك محمية بأحدث تقنيات التشفير العالمية.
            </p>
          </div>
        </div>
      </main>

      <footer className="pb-6 pt-8 text-center text-[22px] text-[#8f7667] sm:pb-6 sm:text-base">
        <div className="mx-auto mb-6 grid size-9 place-items-center rounded-sm bg-slate-800 text-xs text-white shadow-sm">
          🇩🇿
        </div>
        جميع الحقوق محفوظة © 2024 إنجاز 24
      </footer>
    </div>
  );
}
