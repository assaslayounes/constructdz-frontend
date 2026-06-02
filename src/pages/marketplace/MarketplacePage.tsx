import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MessageSquareText, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { resourcesService } from "@/services/resources.service";

type MarketplaceKind = "equipment" | "providers" | "projects";

export function MarketplacePage({ kind }: { kind: MarketplaceKind }) {
  const { t, language } = useI18n();
  const [query, setQuery] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [status, setStatus] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthState();

  const conversationMutation = useMutation({
    mutationFn: ({ participantIds, title }: { participantIds: string[]; title: string }) => resourcesService.getOrCreateConversation(participantIds, title),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
      navigate(`/messages/${conversation.id}`);
      toast.success(t("conversationOpened"));
    },
    onError: () => toast.error(t("conversationError"))
  });

  const profilesQuery = useQuery({ queryKey: ["profiles"], queryFn: resourcesService.profiles, enabled: kind === "providers" });
  const equipmentQuery = useQuery({ queryKey: ["equipment"], queryFn: resourcesService.equipment, enabled: kind === "equipment" });
  const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: resourcesService.projects, enabled: kind === "projects" });

  const rows = useMemo(() => {
    const source = kind === "equipment" ? equipmentQuery.data ?? [] : kind === "providers" ? profilesQuery.data ?? [] : projectsQuery.data ?? [];
    const needle = query.trim().toLowerCase();
    return source.filter((item) => {
      const text = JSON.stringify(item).toLowerCase();
      const price = "pricePerDay" in item ? item.pricePerDay ?? 0 : "budget" in item ? item.budget ?? 0 : "priceFrom" in item ? item.priceFrom ?? 0 : 0;
      const itemWilaya = "wilaya" in item ? item.wilaya : "city" in item ? item.city : "";
      const itemStatus = "status" in item ? item.status : "available" in item ? (item.available ? "available" : "reserved") : "";
      return (!needle || text.includes(needle)) &&
        (!wilaya || itemWilaya === wilaya) &&
        (!status || itemStatus === status) &&
        (!min || price >= Number(min)) &&
        (!max || price <= Number(max));
    });
  }, [equipmentQuery.data, kind, max, min, profilesQuery.data, projectsQuery.data, query, status, wilaya]);

  const title = kind === "equipment" ? t("equipment") : kind === "providers" ? t("providers") : t("projects");
  const description = kind === "equipment"
    ? "Search rentable equipment by type, category, wilaya, availability, rating, price, and date added."
    : kind === "providers"
      ? "Find qualified providers by profession, service type, wilaya, experience, rating, and price range."
      : "Browse construction projects by status, wilaya, budget range, and creation date.";

  return (
    <section className="content-container">
      <PageHeader title={title} description={description} />
      <div className="rounded-lg border border-brand-border/70 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2 font-bold text-brand-ink">
          <SlidersHorizontal className="size-5 text-brand-orange" />
          {t("filters")}
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} className="h-11 rounded-lg border border-brand-border px-3 outline-none" />
          <input value={wilaya} onChange={(event) => setWilaya(event.target.value)} placeholder={t("wilaya")} className="h-11 rounded-lg border border-brand-border px-3 outline-none" />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-lg border border-brand-border bg-white px-3 outline-none">
            <option value="">{t("status")}</option>
            <option value="available">{t("availability")}</option>
            <option value="active">{t("inProgress")}</option>
            <option value="completed">{t("completed")}</option>
          </select>
          <input value={min} onChange={(event) => setMin(event.target.value)} inputMode="numeric" placeholder={kind === "projects" ? t("budgetRange") : t("priceRange")} className="h-11 rounded-lg border border-brand-border px-3 outline-none" />
          <input value={max} onChange={(event) => setMax(event.target.value)} inputMode="numeric" placeholder={language === "ar" ? "الحد الأعلى" : "Maximum"} className="h-11 rounded-lg border border-brand-border px-3 outline-none" />
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((item) => (
          <article key={item.id} className="rounded-lg border border-brand-border/70 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-brand-ink">{"title" in item ? item.title : "companyName" in item ? item.companyName : item.name}</h2>
                <p className="mt-1 text-sm text-brand-muted">{"wilaya" in item ? item.wilaya : "city" in item ? item.city : ""}</p>
              </div>
              <span className="rounded-full bg-brand-bg px-3 py-1 text-xs font-bold text-brand-orange">{"status" in item ? item.status : "available" in item && item.available ? "available" : t("providers")}</span>
            </div>
            <p className="mt-4 line-clamp-3 text-sm leading-7 text-brand-muted">{"description" in item ? item.description : "bio" in item ? item.bio : ""}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="h-10 rounded-lg px-4 text-sm">{t("requestQuote")}</Button>
              <Button
                variant="outline"
                className="h-10 rounded-lg px-4 text-sm"
                onClick={() => {
                  const targetId = "ownerId" in item ? item.ownerId : "userId" in item ? item.userId : undefined;
                  const title = ("title" in item ? item.title : "companyName" in item ? item.companyName : item.name) ?? t("conversation");
                  if (!user?.id || !targetId || targetId === user.id) return;
                  conversationMutation.mutate({ participantIds: [user.id, targetId], title });
                }}
              >
                <MessageSquareText className="size-4" />{t("startConversation")}
              </Button>
            </div>
          </article>
        ))}
        {!rows.length ? <p className="rounded-lg border border-brand-border bg-white p-6 text-center text-brand-muted md:col-span-2 xl:col-span-3">{t("emptyState")}</p> : null}
      </div>
    </section>
  );
}
