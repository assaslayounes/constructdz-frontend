import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, HardHat, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/auth/StepIndicator";
import type { AccountType } from "@/types/domain";

export function RegisterTypePage() {
  const [role, setRole] = useState<AccountType>("owner");
  const navigate = useNavigate();
  const cards = [
    { id: "owner" as const, title: "صاحب مشروع", icon: <HardHat className="size-8 sm:size-10" />, text: "أرغب في طرح مناقصات، إدارة مشاريع البناء الخاصة بي، والعثور على أفضل المقاولين المعتمدين." },
    { id: "provider" as const, title: "مزود خدمة", icon: <Wrench className="size-8 sm:size-10" />, text: "أنا مقاول أو مهندس أو مكتب استشاري أبحث عن فرص عمل جديدة وتوسيع نطاق أعمالي في السوق." }
  ];

  return (
    <section className="relative min-h-screen bg-brand-bg pb-24">
      <div className="auth-container pt-2 sm:pt-4">
        <Link to="/login" className="absolute left-5 top-5 sm:left-7 sm:top-7"><ArrowLeft className="size-7 text-brand-brown" /></Link>
        <h1 className="text-center text-4xl font-bold text-brand-brown sm:text-5xl lg:text-6xl">إنجاز 24</h1>
        <div className="mt-12 sm:mt-16"><StepIndicator current={1} labels={["نوع الحساب", "البيانات", "التحقق"]} /></div>
        <div className="mt-14 text-center sm:mt-20"><h2 className="text-4xl text-black sm:text-5xl">نوع الحساب</h2><p className="mt-4 text-base sm:mt-5 sm:text-xl">يرجى اختيار الفئة التي تصف نشاطك بشكل أفضل</p></div>
        <div className="mt-10 grid gap-6 sm:mt-16 sm:gap-9 lg:grid-cols-2">
          {cards.map((card) => (
            <button key={card.id} onClick={() => setRole(card.id)} className="w-full border-2 border-brand-border bg-white px-5 py-8 text-center transition hover:bg-[#fffaf7] sm:px-8 sm:py-10">
              <div className="mx-auto grid size-24 place-items-center rounded-full bg-[#fee5d7] text-brand-brown sm:size-28">{card.icon}</div>
              <h3 className="mt-8 text-3xl text-black sm:mt-12 sm:text-4xl">{card.title}</h3>
              <p className="mx-auto mt-4 max-w-[430px] text-base leading-8 sm:mt-5 sm:text-xl sm:leading-10">{card.text}</p>
              <span className="mx-auto mt-7 flex size-8 items-center justify-center rounded-full border-4 border-brand-border bg-white sm:mt-8">{role === card.id && <span className="block size-4 rounded-full bg-brand-orange" />}</span>
            </button>
          ))}
        </div>
        <Button onClick={() => navigate("/register/personal", { state: { role } })} className="mt-8 h-14 w-full rounded-xl text-xl sm:mt-10 sm:h-[68px] sm:text-2xl">المتابعة <ArrowLeft /></Button>
        <Button asChild variant="outline" className="mt-4 h-14 w-full rounded-xl text-xl text-red-600 sm:mt-6 sm:h-[68px] sm:text-2xl"><Link to="/login">إلغاء</Link></Button>
      </div>
    </section>
  );
}
