import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  UserPlus,
  KeyRound,
  ShieldCheck,
  Mail,
  PartyPopper,
  Building2,
  Wrench,
  ClipboardList,
  Rocket,
  Search,
  Truck,
  FolderPlus,
  MessageSquareText,
  FileSignature,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nContext";

/* ─── Trigger Variants ───────────────────────────────────────── */

type TriggerVariant = "navbar" | "navbar-mobile" | "drawer" | "auth";

interface HelpDialogProps {
  variant?: TriggerVariant;
}

export function HelpDialog({ variant = "navbar" }: HelpDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <HelpTriggerButton variant={variant} label={t("help")} />
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[80] bg-neutral-950/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "fixed z-[90] flex flex-col overflow-hidden bg-white shadow-2xl outline-none",
                  /* Mobile: full-screen */
                  "inset-0",
                  /* Desktop: centered dialog */
                  "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
                  "sm:max-h-[88vh] sm:w-full sm:max-w-[640px] sm:rounded-3xl sm:border sm:border-neutral-200/80"
                )}
                dir="rtl"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-neutral-100 bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-7 sm:py-5">
                  <Dialog.Title className="flex items-center gap-2.5 text-lg font-extrabold text-neutral-900 sm:text-xl">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <HelpCircle className="size-5" />
                    </span>
                    {t("help")}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 active:scale-95"
                      aria-label="إغلاق"
                    >
                      <X className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-10 pt-6 sm:px-7 sm:pb-12 sm:pt-8">
                  <HelpContent />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/* ─── Trigger Button ─────────────────────────────────────────── */

function HelpTriggerButton({
  variant,
  label,
  ...props
}: {
  variant: TriggerVariant;
  label: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (variant === "navbar") {
    return (
      <button
        {...props}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
      >
        <HelpCircle className="size-4" />
        {label}
      </button>
    );
  }

  if (variant === "navbar-mobile") {
    return (
      <button
        {...props}
        aria-label={label}
        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-700 shadow-sm transition-all hover:bg-amber-50 hover:text-amber-700 active:scale-95 sm:h-12 sm:w-12 lg:h-10 lg:w-10 lg:rounded-xl"
      >
        <HelpCircle className="size-5" />
      </button>
    );
  }

  if (variant === "drawer") {
    return (
      <button
        {...props}
        className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-3 py-3 text-sm font-bold text-amber-700 shadow-sm transition-all hover:bg-amber-50 active:scale-[0.99]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100">
          <HelpCircle className="size-4" />
        </span>
        {label}
      </button>
    );
  }

  /* auth variant — used on Login & Register pages */
  return (
    <button
      {...props}
      className="inline-flex items-center gap-2 rounded-xl border border-[#e7bfa8] bg-white px-4 py-2.5 text-sm font-semibold text-[#684431] shadow-sm transition-all hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 active:scale-[0.98] sm:px-5 sm:py-2"
    >
      <HelpCircle className="size-4 sm:size-[18px]" />
      {label}
    </button>
  );
}

/* ─── Help Content ───────────────────────────────────────────── */

function HelpContent() {
  return (
    <article className="space-y-8">
      {/* Title */}
      <header className="text-center">
        <h2 className="text-2xl font-extrabold leading-snug text-neutral-900 sm:text-3xl">
          مرحباً بك في منصة إنجاز 👋
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-neutral-600 sm:text-lg sm:leading-9">
          منصة إنجاز صُممت لتسهّل عليك الوصول إلى الحرفيين، المقاولين، ومختلف
          معدات وآليات البناء والأشغال بكل سهولة وأمان.
        </p>
      </header>

      <hr className="border-neutral-100" />

      {/* 1 — Create Account */}
      <HelpSection
        number="1️⃣"
        title="إنشاء حساب جديد"
        icon={<UserPlus className="size-5" />}
      >
        <p className="leading-8 text-neutral-600">
          للبدء في استخدام المنصة، يجب عليك إنشاء حساب جديد. اضغط على زر
          <strong className="mx-1 text-amber-700">"إنشاء حساب جديد"</strong>
          في صفحة تسجيل الدخول أو زر
          <strong className="mx-1 text-amber-700">"تسجيل"</strong>
          في شريط التنقل العلوي، ثم اتبع الخطوات التالية.
        </p>
      </HelpSection>

      {/* 2 — Account Type */}
      <HelpSection
        number="2️⃣"
        title="اختيار نوع الحساب"
        icon={<ClipboardList className="size-5" />}
      >
        <p className="mb-5 leading-8 text-neutral-600">
          عند التسجيل، ستحتاج لاختيار نوع حسابك حسب نشاطك:
        </p>

        {/* Owner card */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Building2 className="size-5" />
            </span>
            <h4 className="text-base font-extrabold text-neutral-900 sm:text-lg">
              🏗️ صاحب مشروع
            </h4>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
              أصحاب مشاريع البناء والصيانة
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
              شركات الإنجاز والأشغال العمومية
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
              الجهات الباحثة عن حرفيين أو مقاولين
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
              الباحثون عن معدات وآليات البناء
            </li>
          </ul>
          <div className="mt-4 rounded-xl bg-white/80 p-3 text-sm leading-7 text-neutral-500 sm:text-base">
            <strong className="text-amber-700">المزايا:</strong> نشر المشاريع، استقبال عروض الأسعار، التواصل المباشر مع مزودي الخدمات، ومتابعة تنفيذ المشاريع.
          </div>
        </div>

        {/* Provider card */}
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Wrench className="size-5" />
            </span>
            <h4 className="text-base font-extrabold text-neutral-900 sm:text-lg">
              🛠️ مزود خدمة
            </h4>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-blue-600" />
              الحرفيون
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-blue-600" />
              المقاولون
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-blue-600" />
              مؤسسات الخدمات
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-blue-600" />
              أصحاب المعدات والآليات
            </li>
          </ul>
          <div className="mt-4 rounded-xl bg-white/80 p-3 text-sm leading-7 text-neutral-500 sm:text-base">
            <strong className="text-blue-700">المزايا:</strong> عرض خدماتك ومعداتك، استقبال طلبات العمل، تقديم عروض الأسعار، وبناء سمعتك المهنية.
          </div>
        </div>
      </HelpSection>

      {/* 3 — Personal Info */}
      <HelpSection
        number="3️⃣"
        title="إدخال البيانات الشخصية"
        icon={<ClipboardList className="size-5" />}
      >
        <p className="leading-8 text-neutral-600">
          بعد اختيار نوع الحساب، ستحتاج لإدخال بياناتك الشخصية:
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
            الاسم الكامل (الاسم واللقب)
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
            رقم الهاتف
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
            الولاية والبلدية
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
            المهنة أو التخصص (لمزودي الخدمات)
          </li>
        </ul>
        <p className="mt-3 text-sm leading-7 text-neutral-500 sm:text-base">
          تأكد من إدخال بيانات صحيحة لأنها ستظهر في ملفك الشخصي.
        </p>
      </HelpSection>

      {/* 4 — Login Credentials */}
      <HelpSection
        number="4️⃣"
        title="إدخال بيانات الدخول"
        icon={<KeyRound className="size-5" />}
      >
        <p className="leading-8 text-neutral-600">
          قم بإدخال بيانات الدخول الخاصة بك:
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
          <li className="flex items-start gap-2">
            <Mail className="mt-1 size-4 shrink-0 text-amber-600" />
            <span>
              <strong>البريد الإلكتروني:</strong> استخدم بريداً إلكترونياً صحيحاً وفعّالاً
            </span>
          </li>
          <li className="flex items-start gap-2">
            <KeyRound className="mt-1 size-4 shrink-0 text-amber-600" />
            <span>
              <strong>كلمة المرور:</strong> يجب أن تحتوي على 6 أحرف على الأقل
            </span>
          </li>
        </ul>
      </HelpSection>

      {/* 5 — OTP Activation */}
      <HelpSection
        number="5️⃣"
        title="تفعيل الحساب"
        icon={<ShieldCheck className="size-5" />}
      >
        <p className="leading-8 text-neutral-600">
          بعد إنشاء الحساب، ستحتاج لإدخال رمز التفعيل للتحقق من حسابك.
        </p>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 text-center">
          <p className="mb-2 text-sm font-bold text-amber-800">
            رمز التفعيل المؤقت:
          </p>
          <span className="inline-block rounded-xl bg-white px-8 py-3 font-mono text-3xl font-black tracking-[0.4em] text-amber-700 shadow-sm sm:text-4xl">
            111111
          </span>
          <p className="mt-3 text-xs leading-6 text-amber-700/80 sm:text-sm">
            ⚠️ هذا الرمز مؤقت ويُستخدم خلال مرحلة التطوير الحالية فقط.
          </p>
        </div>
      </HelpSection>

      {/* 6 — Email Verification */}
      <HelpSection
        number="6️⃣"
        title="التحقق من البريد الإلكتروني"
        icon={<Mail className="size-5" />}
      >
        <p className="leading-8 text-neutral-600">
          تأكد من استخدام بريد إلكتروني:
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
            صحيح وفعّال يمكنك الوصول إليه
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
            غير مستخدم مسبقاً في المنصة
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-600" />
            يُفضّل استخدام بريد Gmail أو Outlook
          </li>
        </ul>
      </HelpSection>

      {/* 7 — After Registration */}
      <HelpSection
        number="🎉"
        title="بعد إنشاء الحساب"
        icon={<PartyPopper className="size-5" />}
        accentColor="emerald"
      >
        <p className="leading-8 text-neutral-600">
          بعد التسجيل بنجاح، يمكنك الاستفادة من جميع خدمات المنصة:
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <FeatureItem
            icon={<Search className="size-4" />}
            text="البحث عن الحرفيين والمقاولين"
          />
          <FeatureItem
            icon={<Truck className="size-4" />}
            text="استعراض المعدات والآليات"
          />
          <FeatureItem
            icon={<FolderPlus className="size-4" />}
            text="إنشاء المشاريع"
          />
          <FeatureItem
            icon={<Rocket className="size-4" />}
            text="استقبال عروض الأسعار"
          />
          <FeatureItem
            icon={<MessageSquareText className="size-4" />}
            text="التواصل مع مزودي الخدمات"
          />
          <FeatureItem
            icon={<FileSignature className="size-4" />}
            text="إبرام العقود ومتابعة الإنجاز"
          />
        </div>
      </HelpSection>

      {/* Footer */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-blue-50 p-5 text-center sm:p-6">
        <p className="text-sm font-bold leading-7 text-neutral-700 sm:text-base">
          🚀 نتمنى لك تجربة ممتعة ومثمرة على منصة إنجاز!
        </p>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          إذا واجهت أي مشكلة، لا تتردد في التواصل مع فريق الدعم.
        </p>
      </div>
    </article>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function HelpSection({
  number,
  title,
  icon,
  accentColor = "amber",
  children,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  accentColor?: "amber" | "emerald";
  children: React.ReactNode;
}) {
  const accent =
    accentColor === "emerald"
      ? { bg: "bg-emerald-100", text: "text-emerald-700" }
      : { bg: "bg-amber-100", text: "text-amber-700" };

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
            accent.bg,
            accent.text
          )}
        >
          {icon}
        </span>
        <h3 className="text-base font-extrabold text-neutral-900 sm:text-lg">
          <span className="ml-1.5">{number}</span>
          {title}
        </h3>
      </div>
      <div className="pr-12 text-sm sm:text-base">{children}</div>
    </section>
  );
}

function FeatureItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 text-sm font-medium text-neutral-700 transition-all hover:border-amber-200 hover:bg-amber-50/50 sm:text-base">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        {icon}
      </span>
      {text}
    </div>
  );
}
