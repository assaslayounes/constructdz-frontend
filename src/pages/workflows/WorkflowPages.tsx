import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle2, CreditCard, FileSignature, MessageSquareText, Send, Star, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { resourcesService } from "@/services/resources.service";
import { contractStatusLabel, normalizeContractStatus } from "@/lib/contract";
import type { ContractStatus, ExecutionStatus, PaymentStatus, QuoteStatus } from "@/types/domain";

export function MessagesPage() {
  const { user } = useAuthState();
  const { t } = useI18n();
  const query = useQuery({ queryKey: ["conversations", user?.id], queryFn: () => resourcesService.conversations(user!.id), enabled: Boolean(user?.id) });
  const conversations = query.data ?? [];

  return (
    <section className="content-container">
      <PageHeader title={t("messages")} description="Conversation list, chat history, unread indicators, and provider/equipment contact workflows." />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-lg border border-brand-border bg-white p-3">
          {conversations.map((item) => (
            <button key={item.id} className="mb-2 flex w-full items-center justify-between rounded-lg p-3 text-start hover:bg-brand-bg">
              <span><b>{item.title}</b><small className="block text-brand-muted">{item.lastMessage}</small></span>
              {item.unreadCount ? <span className="rounded-full bg-brand-orange px-2 text-xs font-bold text-white">{item.unreadCount}</span> : null}
            </button>
          ))}
          {!conversations.length ? <p className="p-4 text-sm text-brand-muted">{t("emptyState")}</p> : null}
        </aside>
        <div className="rounded-lg border border-brand-border bg-white p-5">
          <MessageSquareText className="mb-4 size-7 text-brand-orange" />
          <p className="text-brand-muted">Select a conversation to view message history. Real-time delivery is ready for WebSocket/SSE integration when the backend supports it.</p>
          <div className="mt-6 flex gap-2">
            <input className="h-11 flex-1 rounded-lg border border-brand-border px-3 outline-none" placeholder={t("messages")} />
            <Button className="rounded-lg"><Send className="size-4" /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NotificationsPage() {
  const { user } = useAuthState();
  const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => resourcesService.notifications(user!.id),
    enabled: Boolean(user?.id),
    refetchInterval: 5000,
    staleTime: 5000
  });
  const mutation = useMutation({
    mutationFn: (id: string) => resourcesService.updateNotification(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] })
  });

  return (
    <section className="content-container">
      <PageHeader title={t("notifications")} description="Messages, quote requests, contract updates, payments, reviews, and project update alerts." />
      <div className="space-y-3">
        {(query.data ?? []).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              mutation.mutate(item.id);
              if (item.type === "message" && item.conversationId) {
                navigate(`/messages/${item.conversationId}`);
              }
            }}
            className="flex w-full items-start gap-3 rounded-lg border border-brand-border bg-white p-4 text-start shadow-sm transition hover:bg-brand-bg"
          >
            <Bell className="mt-1 size-5 text-brand-orange" />
            <span className="flex-1"><b>{item.title}</b><small className="block text-brand-muted">{item.body}</small></span>
            {!item.read ? <span className="size-2 rounded-full bg-brand-orange" /> : null}
          </button>
        ))}
        {!query.data?.length ? <p className="rounded-lg border border-brand-border bg-white p-6 text-center text-brand-muted">{t("emptyState")}</p> : null}
      </div>
    </section>
  );
}

export function QuotesPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["quotes"], queryFn: resourcesService.quotes });
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuoteStatus }) => resourcesService.updateQuote(id, { status }),
    onSuccess: () => {
      toast.success(t("quoteHistory"));
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    }
  });

  return <StatusBoard title={t("quotes")} description="Create, accept, reject, and track quote requests." icon={FileSignature} rows={(query.data ?? []).map((q) => ({ id: q.id, title: q.title, meta: q.amount.toLocaleString(), status: q.status, actions: <>
    <Button className="h-10 rounded-lg px-4 text-sm" onClick={() => mutation.mutate({ id: q.id, status: "accepted" })}>{t("accept")}</Button>
    <Button className="h-10 rounded-lg px-4 text-sm" variant="outline" onClick={() => mutation.mutate({ id: q.id, status: "rejected" })}>{t("reject")}</Button>
  </> }))} />;
}

export function ContractsPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["contracts"], queryFn: resourcesService.contracts });
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContractStatus }) => resourcesService.updateContract(id, { status, signedAt: new Date().toISOString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contracts"] })
  });

  return <StatusBoard title={t("contracts")} description="Contract details, status history, digital approval, and signature confirmation." icon={FileSignature} rows={(query.data ?? []).map((c) => {
    const status = normalizeContractStatus(c.contractStatus ?? c.status);
    return {
      id: c.id,
      title: c.title,
      meta: c.serviceType ? `${c.serviceType} • ${c.duration}` : c.history?.join(" / "),
      status: contractStatusLabel[status],
      actions: <Link to={`/contracts/${c.id}`} className="h-10 rounded-lg bg-brand-orange px-4 text-sm font-semibold text-white inline-flex items-center justify-center">عرض التفاصيل</Link>
    };
  })} />;
}

export function PaymentsPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["payments"], queryFn: resourcesService.payments });
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) => resourcesService.updatePayment(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] })
  });

  return <StatusBoard title={t("payments")} description="Payment initiation, confirmation, transaction IDs, logs, and payment history." icon={CreditCard} rows={(query.data ?? []).map((p) => ({ id: p.id, title: p.transactionId, meta: p.amount.toLocaleString(), status: p.status, actions: <Button className="h-10 rounded-lg px-4 text-sm" onClick={() => mutation.mutate({ id: p.id, status: "paid" })}>{t("confirmPayment")}</Button> }))} />;
}

export function ProjectExecutionPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<ExecutionStatus>("not_started");

  return (
    <section className="content-container">
      <PageHeader title={t("execution")} description="Track project execution from not started to completion with updates, photos, and owner confirmation." />
      <div className="rounded-lg border border-brand-border bg-white p-5">
        <select value={status} onChange={(event) => setStatus(event.target.value as ExecutionStatus)} className="h-12 w-full rounded-lg border border-brand-border bg-white px-3">
          <option value="not_started">{t("notStarted")}</option>
          <option value="in_progress">{t("inProgress")}</option>
          <option value="completed">{t("completed")}</option>
          <option value="cancelled">{t("cancelled")}</option>
        </select>
        <textarea className="mt-4 min-h-32 w-full rounded-lg border border-brand-border p-3 outline-none" placeholder={t("progressUpdate")} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button><Upload className="size-4" />{t("uploadPhotos")}</Button>
          <Button variant="outline"><CheckCircle2 className="size-4" />{t("approve")}</Button>
        </div>
      </div>
    </section>
  );
}

export function ReviewsPage() {
  const { t } = useI18n();
  const categories = [t("quality"), t("communication"), t("timeliness"), t("pricing"), t("professionalism")];
  const average = useMemo(() => "4.8", []);

  return (
    <section className="content-container">
      <PageHeader title={t("reviews")} description="Both parties can review each other and track average ratings by category." />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-brand-border bg-white p-5 text-center">
          <Star className="mx-auto mb-3 size-8 fill-brand-orange text-brand-orange" />
          <p className="text-4xl font-extrabold">{average}</p>
          <p className="text-sm text-brand-muted">{t("reviewHistory")}</p>
        </div>
        <form className="rounded-lg border border-brand-border bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => <input key={category} type="number" min="1" max="5" placeholder={category} className="h-11 rounded-lg border border-brand-border px-3" />)}
          </div>
          <textarea className="mt-3 min-h-28 w-full rounded-lg border border-brand-border p-3" placeholder={t("reviews")} />
          <Button className="mt-3 rounded-lg">{t("create")}</Button>
        </form>
      </div>
    </section>
  );
}

type Row = { id: string; title: string; meta?: string; status: string; actions?: ReactNode };

function StatusBoard({ title, description, icon: Icon, rows }: { title: string; description: string; icon: typeof FileSignature; rows: Row[] }) {
  const { t } = useI18n();
  return (
    <section className="content-container">
      <PageHeader title={title} description={description} />
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="flex flex-col gap-4 rounded-lg border border-brand-border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Icon className="mt-1 size-5 text-brand-orange" />
              <div><h2 className="font-extrabold">{row.title}</h2><p className="text-sm text-brand-muted">{row.meta}</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-bg px-3 py-1 text-xs font-bold text-brand-orange">{row.status}</span>
              {row.actions}
            </div>
          </article>
        ))}
        {!rows.length ? <p className="rounded-lg border border-brand-border bg-white p-6 text-center text-brand-muted">{t("emptyState")}</p> : null}
      </div>
    </section>
  );
}
