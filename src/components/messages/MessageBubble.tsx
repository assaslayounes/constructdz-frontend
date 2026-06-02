import { Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import type { Message } from "@/types/domain";
import { formatConversationTime } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

export function MessageBubble({ message, isSender }: MessageBubbleProps) {
  const { t } = useI18n();

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-[32px] border px-4 py-3 shadow-sm ${isSender ? "rounded-br-none bg-brand-orange text-white" : "rounded-bl-none bg-brand-bg text-brand-ink"}`}>
        <p className="whitespace-pre-wrap text-sm leading-6">{message.message}</p>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-brand-muted">
          <span>{formatConversationTime(message.createdAt)}</span>
          {isSender ? (
            <span className="inline-flex items-center gap-1">
              <Check className="size-3" />
              {message.read ? t("read") : t("sent")}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
