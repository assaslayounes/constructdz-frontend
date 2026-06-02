import { Clock3 } from "lucide-react";
import type { Conversation } from "@/types/domain";
import { formatConversationTime } from "@/lib/utils";

interface ConversationListItemProps {
  conversation: Conversation;
  onClick: () => void;
}

const roleLabels: Record<string, { ar: string; en: string }> = {
  provider: { ar: "مقدم خدمة", en: "Provider" },
  service_provider: { ar: "مقدم خدمة", en: "Service Provider" },
  owner: { ar: "صاحب مشروع", en: "Client" },
  equipment_owner: { ar: "صاحب معدات", en: "Equipment Owner" },
  project_owner: { ar: "صاحب مشروع", en: "Project Owner" }
};

export function ConversationListItem({ conversation, onClick }: ConversationListItemProps) {
  const otherParticipant = conversation.otherParticipant;
  const participantName = otherParticipant
    ? `${otherParticipant.firstName || ""} ${otherParticipant.lastName || ""}`.trim() || conversation.title
    : conversation.title;

  const roleAr = otherParticipant?.role ? roleLabels[otherParticipant.role]?.ar : "";
  const initials = (otherParticipant?.firstName?.charAt(0) || "") + (otherParticipant?.lastName?.charAt(0) || "") || "؟";

  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-3 rounded-3xl border px-4 py-4 text-left transition ${hasUnread ? "border-brand-orange/30 bg-brand-orange/5" : "border-brand-border bg-white hover:border-brand-orange hover:bg-brand-bg"}`}
    >
      <div className="flex items-center gap-3">
        {otherParticipant?.profileImage ? (
          <img src={otherParticipant.profileImage} alt={participantName} className="h-12 w-12 shrink-0 rounded-3xl object-cover" />
        ) : (
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-brand-orange/10 text-sm font-black text-brand-orange">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-brand-ink">{participantName}</p>
          {roleAr && <p className="mt-0.5 truncate text-xs text-brand-muted">{roleAr}</p>}
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-brand-muted">{conversation.lastMessage || "-"}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="flex items-center gap-1 text-[11px] font-bold uppercase text-brand-muted">
          <Clock3 className="size-3" />
          {formatConversationTime(conversation.updatedAt)}
        </span>
        <div className="flex items-center gap-2">
          {conversation.isOnline ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-label="Online" /> : <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-label="Offline" />}
          {conversation.unreadCount ? (
            <span className="rounded-full bg-brand-orange px-2 py-1 text-[11px] font-bold text-white">{conversation.unreadCount}</span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
