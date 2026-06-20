import { Link } from "react-router-dom";
import { ArrowLeft, Check, Compass, Headphones, Store, UserCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/context/AuthContext";

const successContent = {
  owner: {
    heading: "مرحباً بك كصاحب مشروع!",
    subheading: "تم إنشاء حسابك بنجاح",
    description:
      "أنت الآن جاهز للانطلاق. يمكنك نشر مشروعك الأول، استعراض الحرفيين والمقاولين المعتمدين، واستقبال عروض الأسعار لإنجاز أعمالك بكفاءة واحترافية.",
    cards: [
      {
        icon: Store,
        title: "انشر مشروعك الأول",
        description:
          "أضف تفاصيل مشروعك الإنشائي واستقبل عروضاً من مقاولين وحرفيين مؤهلين.",
      },
      {
        icon: Compass,
        title: "ابحث عن حرفيين ومعدات",
        description:
          "تصفح قائمة الحرفيين والمقاولين المعتمدين، واستكشف معدات وآليات البناء المتاحة.",
      },
    ],
    cta: "انطلق الآن",
  },
  provider: {
    heading: "مرحباً بك كمزود خدمة!",
    subheading: "تم إنشاء حسابك بنجاح",
    description:
      "حسابك جاهز لاستقبال فرص العمل. أكمل ملفك المهني وابدأ بعرض خدماتك أو تأجير معداتك للوصول إلى عملاء جدد وتحقيق دخل إضافي.",
    cards: [
      {
        icon: UserCheck,
        title: "أكمل ملفك المهني",
        description:
          "أضف مهاراتك وخبراتك وصور أعمالك السابقة لتعزيز ظهورك أمام أصحاب المشاريع.",
      },
      {
        icon: Briefcase,
        title: "اعرض خدماتك أو معداتك",
        description:
          "أضف خدماتك الحرفية أو معداتك المتاحة للتأجير وابدأ في استقبال طلبات العملاء.",
      },
    ],
    cta: "ابدأ رحلتك المهنية",
  },
} as const;

export function RegisterSuccessPage() {
  const { user } = useAuthState();
  const role = user?.role === "provider" ? "provider" : "owner";
  const content = successContent[role];

  return (
    <section className="min-h-screen bg-dot py-4">
      <div className="auth-container">
        <h1 className="text-right text-4xl font-bold text-brand-brown sm:text-5xl lg:text-6xl">إنجاز</h1>
        <div className="soft-card mt-14 px-5 py-8 text-center sm:mt-24 sm:px-10 sm:py-12">
          <div className="mx-auto grid size-28 place-items-center rounded-full bg-brand-orange text-white shadow-xl sm:size-36"><Check className="size-14 sm:size-20" /></div>
          <p className="mt-8 text-xl text-brand-brown sm:mt-10 sm:text-2xl">{content.subheading}</p>
          <h2 className="mt-4 text-4xl leading-[1.25] text-black sm:mt-6 sm:text-5xl">{content.heading}</h2>
          <p className="mt-6 text-lg leading-8 sm:mt-8 sm:text-2xl sm:leading-10">{content.description}</p>
          <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-7 lg:grid-cols-2">
            {content.cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-brand-border bg-[#ffe7da] p-6 text-right sm:p-8">
                <card.icon className="mb-5 mr-auto size-12 rounded-xl bg-[#ffd4bc] p-3 text-brand-brown sm:mb-7 sm:size-14" />
                <h3 className="text-2xl sm:text-3xl">{card.title}</h3>
                <p className="mt-3 text-base sm:text-xl">{card.description}</p>
              </div>
            ))}
          </div>
          <Button asChild className="mt-10 h-14 w-full rounded-xl text-xl sm:mt-14 sm:h-[78px] sm:text-2xl"><Link to="/">{content.cta} <ArrowLeft /></Link></Button>
          <a className="mt-7 block font-bold text-brand-brown sm:mt-9" href="#"><Headphones className="inline size-5" /> تحتاج مساعدة؟ تواصل مع الدعم الفني</a>
        </div>
      </div>
    </section>
  );
}
