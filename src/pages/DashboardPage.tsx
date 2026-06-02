import { Bell, BriefcaseBusiness, CreditCard, FileSignature, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useI18n } from "@/i18n/I18nContext";

export function DashboardPage() {
  const { t } = useI18n();

  return (
    <section className="content-container">
      <PageHeader
        title={t("accountOverview")}
        description="Manage projects, marketplace activity, quotes, contracts, payments, notifications, and audit history from one operational workspace."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("activeProjects")} value="4" icon={BriefcaseBusiness} />
        <StatCard label={t("pendingQuotes")} value="7" icon={FileSignature} />
        <StatCard label={t("paymentHealth")} value="92%" icon={CreditCard} />
        <StatCard label={t("unreadMessages")} value="3" icon={MessageSquareText} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          [t("messages"), "/messages", MessageSquareText],
          [t("notifications"), "/notifications", Bell],
          [t("quotes"), "/quotes", FileSignature],
          [t("contracts"), "/contracts", FileSignature],
          [t("payments"), "/payments", CreditCard],
          [t("projects"), "/projects", BriefcaseBusiness]
        ].map(([label, to, Icon]) => (
          <Link key={to as string} to={to as string} className="rounded-lg border border-brand-border/70 bg-white p-5 font-bold text-brand-ink shadow-sm transition hover:border-brand-orange hover:text-brand-orange">
            <Icon className="mb-4 size-6" />
            {label as string}
          </Link>
        ))}
      </div>
    </section>
  );
}
