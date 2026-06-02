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
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <AuthBrand />
      <div className="flex-1 flex items-center justify-center pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-container -mt-32 rounded-[20px] border border-brand-border bg-white px-5 py-8 shadow-xl sm:px-10 sm:py-12 w-full max-w-md">
          <h2 className="mb-6 text-center text-3xl text-[#684431] sm:mb-8 sm:text-4xl">تسجيل الدخول</h2>
          <label className="mb-2 block text-right text-base text-[#4a2d20] sm:mb-3 sm:text-lg">البريد الإلكتروني أو رقم الهاتف</label>
          <Input {...register("identifier")} icon={<Mail />} placeholder="example@mail.com" />
          {errors.identifier && <p className="mt-2 text-sm text-red-600">{errors.identifier.message}</p>}
          <div className="mt-5 flex items-center justify-between text-sm sm:mt-6 sm:text-base">
            <a className="text-brand-blue" href="#">نسيت كلمة المرور؟</a>
            <label className="text-[#4a2d20]">كلمة المرور</label>
          </div>
          <Input {...register("password")} type="password" icon={<Lock />} placeholder="••••••••" />
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          <Button disabled={login.isPending} className="mt-6 h-12 w-full rounded-xl text-lg sm:mt-8 sm:h-14 sm:text-xl">{login.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</Button>
          <p className="mt-6 text-center text-sm sm:mt-8 sm:text-base">ليس لديك حساب؟</p>
          <Button asChild variant="outline" className="mt-3 h-12 w-full rounded-xl text-lg sm:mt-4 sm:h-14 sm:text-xl">
            <Link to="/register/type">إنشاء حساب جديد</Link>
          </Button>
        </form>
      </div>

      <div className="mx-auto mb-8 w-full max-w-md flex items-center gap-3 rounded-[18px] border border-black/10 bg-white px-4 py-4 text-right sm:gap-5 sm:px-6 sm:py-5">
        <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#9aa0ff] text-blue-950 sm:size-14"><ShieldCheck /></div>
        <div><h3 className="text-base sm:text-lg">آمن ومعتمد</h3><p className="mt-1 text-sm leading-5 sm:text-base sm:leading-6">بيانات مشاريعك محمية بأحدث تقنيات التشفير.</p></div>
      </div>
      <footer className="pb-4 text-center text-sm text-[#8f7667] sm:pb-6 sm:text-base">ConstructDZ 2024 © جميع الحقوق محفوظة</footer>
    </div>
  );
}
