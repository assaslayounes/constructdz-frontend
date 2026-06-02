import { Link } from "react-router-dom";
import { ArrowLeft, Check, Compass, Headphones, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegisterSuccessPage() {
  return (
    <section className="min-h-screen bg-dot py-4">
      <div className="auth-container">
        <h1 className="text-right text-4xl font-bold text-brand-brown sm:text-5xl lg:text-6xl">إنجاز 24</h1>
        <div className="soft-card mt-14 px-5 py-8 text-center sm:mt-24 sm:px-10 sm:py-12">
          <div className="mx-auto grid size-28 place-items-center rounded-full bg-brand-orange text-white shadow-xl sm:size-36"><Check className="size-14 sm:size-20" /></div>
          <h2 className="mt-10 text-4xl leading-[1.25] text-black sm:mt-16 sm:text-5xl">تم إنشاء الحساب<br />بنجاح!</h2>
          <p className="mt-6 text-lg leading-8 sm:mt-8 sm:text-2xl sm:leading-10">مرحباً بك في إنجاز 24. يمكنك الآن البدء في استكشاف الخدمات أو إضافة مشروعك الأول.</p>
          <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-7 lg:grid-cols-2">
            <div className="rounded-2xl border border-brand-border bg-[#ffe7da] p-6 text-right sm:p-8">
              <Compass className="mb-5 mr-auto size-12 rounded-xl bg-[#ffd4bc] p-3 text-brand-brown sm:mb-7 sm:size-14" />
              <h3 className="text-2xl sm:text-3xl">استكشف الخدمات</h3><p className="mt-3 text-base sm:text-xl">تصفح قائمة المقاولين والموردين المعتمدين.</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-[#ffe7da] p-6 text-right sm:p-8">
              <Store className="mb-5 mr-auto size-12 rounded-xl bg-[#ffd4bc] p-3 text-brand-brown sm:mb-7 sm:size-14" />
              <h3 className="text-2xl sm:text-3xl">مشروع جديد</h3><p className="mt-3 text-base sm:text-xl">ابدأ بإضافة تفاصيل مشروعك الإنشائي الأول.</p>
            </div>
          </div>
          <Button asChild className="mt-10 h-14 w-full rounded-xl text-xl sm:mt-14 sm:h-[78px] sm:text-2xl"><Link to="/">ابدأ الآن <ArrowLeft /></Link></Button>
          <a className="mt-7 block font-bold text-brand-brown sm:mt-9" href="#"><Headphones className="inline size-5" /> تحتاج مساعدة؟ تواصل مع الدعم الفني</a>
        </div>
      </div>
    </section>
  );
}
