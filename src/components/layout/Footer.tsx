import { Globe2, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t } = useI18n();
  const footerItems = [
    { to: "/", label: t("home") },
    { to: "/equipment", label: t("equipment") },
    { to: "/providers", label: t("providers") },
    { to: "/projects", label: t("projects") },
    { to: "/messages", label: t("messages") }
  ];

  return (
    <footer className="mt-14 border-t border-brand-border/70 bg-white">
      <div className="content-container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand-orange">{t("appName")}</h2>
          <p className="mt-3 text-sm leading-7 text-brand-muted">منصة خدمات البناء، إدارة المشاريع، العقود، المدفوعات، والتقييمات.</p>
          <div className="mt-4 flex gap-2 text-brand-brown">
            <Globe2 className="size-5" />
            <Share2 className="size-5" />
          </div>
        </div>
        <div>
          <h3 className="font-extrabold text-brand-ink">{t("quickLinks")}</h3>
          <nav className="mt-3 grid gap-2 text-sm">
            {footerItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => cn("text-brand-muted hover:text-brand-orange", isActive && "font-bold text-brand-orange")}>{label}</NavLink>
            ))}
          </nav>
        </div>
        <div>
          <h3 className="font-extrabold text-brand-ink">{t("contact")}</h3>
          <div className="mt-3 grid gap-2 text-sm text-brand-muted">
            <span className="inline-flex items-center gap-2"><Mail className="size-4" /> support@injaz24.dz</span>
            <span className="inline-flex items-center gap-2"><Phone className="size-4" /> +213 555 000 000</span>
            <span className="inline-flex items-center gap-2"><MapPin className="size-4" /> Algeria</span>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-border/70 py-4 text-center text-xs text-brand-muted">
        © {new Date().getFullYear()} {t("appName")}. {t("copyright")} · {t("terms")} · {t("privacy")}
      </div>
    </footer>
  );
}
