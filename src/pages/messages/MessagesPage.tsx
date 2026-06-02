import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuthState } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { resourcesService } from "@/services/resources.service";
import { ConversationListItem } from "@/components/messages/ConversationListItem";

export function MessagesPage() {
  const { user } = useAuthState();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: () => resourcesService.conversations(user!.id),
    enabled: Boolean(user?.id),
    refetchInterval: 5000,
    staleTime: 10000
  });

  const conversations = useMemo(
    () => (query.data ?? []).slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [query.data]
  );

  const unreadTotal = useMemo(
    () => conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
    [conversations]
  );
  const previousUnread = useRef(0);

  useEffect(() => {
    if (previousUnread.current > 0 && unreadTotal > previousUnread.current) {
      toast.success(t("newMessageReceived"));
    }
    previousUnread.current = unreadTotal;
  }, [unreadTotal, t]);

  const filtered = conversations.filter((conversation) => {
    const needle = search.trim().toLowerCase();
    if (!needle) return true;

    const title = conversation.title?.toLowerCase() ?? "";
    const lastMessage = conversation.lastMessage?.toLowerCase() ?? "";
    const firstName = conversation.otherParticipant?.firstName?.toLowerCase() ?? "";
    const lastName = conversation.otherParticipant?.lastName?.toLowerCase() ?? "";
    const role = conversation.otherParticipant?.role?.toLowerCase() ?? "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();

    return title.includes(needle) || lastMessage.includes(needle) || firstName.includes(needle) || lastName.includes(needle) || fullName.includes(needle) || role.includes(needle);
  });

  return (
    <section className="content-container">
      <PageHeader title={t("messages")} description={t("messageCenterDescription")} />

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-3xl border border-brand-border bg-white p-4 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-ink">{t("conversations")}</p>
              <p className="mt-1 text-xs text-brand-muted">{t("conversationSummary")}</p>
            </div>
            <MessageSquareText className="size-7 text-brand-orange" />
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-3xl border border-brand-border bg-brand-bg px-3 py-2">
            <Search className="size-4 text-brand-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchConversations")}
              className="h-11 flex-1 bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-muted"
            />
          </div>

          <div className="space-y-2">
            {filtered.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                onClick={() => navigate(`/messages/${conversation.id}`)}
              />
            ))}
          </div>

          {!filtered.length ? (
            <p className="rounded-3xl border border-brand-border bg-white p-4 text-sm text-brand-muted">
              {t("emptyState")}
            </p>
          ) : null}
        </aside>

        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <MessageSquareText className="size-10 text-brand-orange" />
            <h2 className="text-xl font-extrabold text-brand-ink">{t("selectConversation")}</h2>
            <p className="max-w-xl text-sm leading-6 text-brand-muted">{t("chooseChatPlaceholder")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
