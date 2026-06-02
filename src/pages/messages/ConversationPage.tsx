import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, MessageSquareText, FileSignature, Plus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { useAuthState } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { resourcesService } from "@/services/resources.service";
import type { Conversation, ContractResponsibility, Message } from "@/types/domain";

export function ConversationPage() {
  const { user } = useAuthState();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messageText, setMessageText] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [totalPrice, setTotalPrice] = useState<number | string>("");
  const [advancePayment, setAdvancePayment] = useState<number | string>("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const conversationQuery = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => resourcesService.conversationById(conversationId!, user?.id),
    enabled: Boolean(conversationId),
    staleTime: 10000
  });

  const contractsQuery = useQuery({
    queryKey: ["contracts"],
    queryFn: resourcesService.contracts,
    enabled: Boolean(conversationId),
    staleTime: 10000
  });

  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => resourcesService.messages(conversationId!),
    enabled: Boolean(conversationId),
    refetchInterval: 5000,
    staleTime: 5000
  });

  const sendMessageMutation = useMutation({
    mutationFn: (payload: Omit<Message, "id"> & { conversation: Conversation }) => resourcesService.sendMessage(payload),
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
    },
    onError: () => toast.error(t("messageSendError"))
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      const unread = (messagesQuery.data ?? []).filter((item) => !item.read && item.senderId !== user?.id);
      if (!unread.length) return;
      await resourcesService.markMessagesRead(unread, conversationId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
    }
  });

  const conversation = conversationQuery.data;
  const contracts = contractsQuery.data ?? [];
  const messages = messagesQuery.data ?? [];

  const linkedContractId = useMemo(() => {
    if (!conversation) return undefined;
    if (conversation.contractId) return conversation.contractId;

    const participantIds = [...conversation.participantIds].sort();
    const match = contracts.find((contract) => {
      const participants = [contract.clientId, contract.providerId].sort();
      return participants.length === participantIds.length && participants.every((id, index) => id === participantIds[index]);
    });
    return match?.id;
  }, [contracts, conversation]);

  const createContractMutation = useMutation({
    mutationFn: async (values?: { serviceType: string; totalPrice: number; advancePayment?: number | string; duration: string; startDate?: string }) => {
      if (!conversation || !user) {
        throw new Error("لا توجد بيانات كافية لإنشاء العقد");
      }

      const otherParticipantId = conversation.participantIds.find((id) => id !== user.id);
      if (!otherParticipantId) {
        throw new Error("لا يمكن إنشاء العقد بدون طرف ثاني");
      }

      const isCurrentProvider = user.role === "provider" || user.role === "service_provider" || user.role === "equipment_owner";
      const clientId = isCurrentProvider ? otherParticipantId : user.id;
      const providerId = isCurrentProvider ? user.id : otherParticipantId;

      const payloadValues = values ?? {
        serviceType: "",
        totalPrice: 0,
        advancePayment: undefined,
        duration: "",
        startDate: undefined
      };

      if (!payloadValues.serviceType || !payloadValues.totalPrice || !payloadValues.duration || !payloadValues.startDate) {
        throw new Error("يرجى ملء جميع الحقول المطلوبة: نوع الخدمة، السعر الإجمالي، الدفعة المقدمة، المدة، وتاريخ البداية");
      }

      const contractPayload = {
        title: `${conversation.title} - عقد`,
        serviceType: payloadValues.serviceType,
        duration: payloadValues.duration,
        totalPrice: Number(payloadValues.totalPrice),
        paymentTerms: `${payloadValues.advancePayment ?? ""}`,
        responsibilities: [
          { party: "project_owner" as const, description: "دفع المبلغ المتفق عليه في المواعيد المحددة." },
          { party: "service_provider" as const, description: "تنفيذ العمل بجودة عالية وفق المواصفات المتفق عليها." }
        ] as ContractResponsibility[],
        clientId,
        providerId,
        contractStatus: "pending_signature" as const,
        signatures: [],
        history: ["تم إنشاء العقد بعد اتفاق الطرفين"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const contract = await resourcesService.createContract(contractPayload);
      await resourcesService.updateConversation(conversation.id, { contractId: contract.id, updatedAt: new Date().toISOString() });
      return contract;
    },
    onSuccess: (contract) => {
      setShowCreateForm(false);
      setServiceType("");
      setTotalPrice("");
      setAdvancePayment("");
      setDuration("");
      setStartDate("");
      queryClient.invalidateQueries({ queryKey: ["conversation", conversation?.id] });
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("تم إنشاء العقد بنجاح");
      if (contract?.id) {
        navigate(`/contracts/${contract.id}`);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء العقد");
    }
  });

  const handleCreateSubmit = (event: FormEvent) => {
    event.preventDefault();
    try {
      createContractMutation.mutate({ serviceType, totalPrice: Number(totalPrice), advancePayment, duration, startDate });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطأ في الإدخال");
    }
  };

  // Prevent body scrolling while the create form is open
  useEffect(() => {
    if (showCreateForm) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [showCreateForm]);

  const otherParticipant = useMemo(() => {
    if (!conversation || !user) return null;
    return conversation.participantIds.find((participantId) => participantId !== user.id) ?? conversation.participantIds[0];
  }, [conversation, user]);

  useEffect(() => {
    if (!conversation || !user) return;
    if (!conversation.participantIds.includes(user.id)) {
      toast.error(t("unauthorizedConversation"));
      navigate("/messages");
    }
  }, [conversation, navigate, t, user]);

  useEffect(() => {
    if (messages.length) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    if (messages.some((item) => !item.read && item.senderId !== user?.id)) {
      markReadMutation.mutate();
    }
  }, [messages, user?.id, markReadMutation]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!messageText.trim() || !conversation || !user) return;

    const receiverId = conversation.participantIds.find((id) => id !== user.id) ?? conversation.participantIds[0];

    sendMessageMutation.mutate({
      conversationId: conversation.id,
      senderId: user.id,
      receiverId,
      message: messageText.trim(),
      read: false,
      createdAt: new Date().toISOString(),
      conversation
    });
  };

  return (
    <section className="content-container">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-11 rounded-full px-4 text-sm" onClick={() => navigate("/messages")}>
            <ArrowLeft className="size-4" />
            {t("backToMessages")}
          </Button>
          {linkedContractId ? (
            <Link to={`/contracts/${linkedContractId}`} className="h-11 rounded-full bg-brand-orange px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-brown">
              <FileSignature className="size-4 inline-block align-middle" />
              <span className="mr-2 inline-block align-middle">{t("openContract")}</span>
            </Link>
          ) : createContractMutation.isPending ? (
            <Button className="h-11 rounded-full bg-brand-orange px-4 py-3 text-sm font-semibold text-white">جارٍ الإنشاء...</Button>
          ) : showCreateForm ? (
            <form onSubmit={handleCreateSubmit} className="flex items-center gap-2">
              <input required value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="نوع الخدمة" className="h-11 rounded-full border border-brand-border px-4 text-sm" />
              <input required value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} placeholder="السعر الإجمالي" type="number" className="h-11 w-28 rounded-full border border-brand-border px-4 text-sm" />
              <input required value={advancePayment} onChange={(e) => setAdvancePayment(e.target.value)} placeholder="الدفعة المقدمة" type="number" className="h-11 w-28 rounded-full border border-brand-border px-4 text-sm" />
              <input required value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="المدة" className="h-11 w-28 rounded-full border border-brand-border px-4 text-sm" />
              <input required value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="تاريخ البداية" type="date" className="h-11 rounded-full border border-brand-border px-3 text-sm" />
              <Button type="submit" className="h-11 rounded-full bg-brand-orange px-4 py-3 text-sm font-semibold text-white"><Plus className="size-4 inline-block align-middle" /></Button>
              <Button type="button" variant="outline" className="h-11 rounded-full px-4 text-sm" onClick={() => setShowCreateForm(false)}>إلغاء</Button>
            </form>
          ) : (
            <Button className="h-11 rounded-full bg-brand-orange px-4 py-3 text-sm font-semibold text-white" onClick={() => setShowCreateForm(true)}>
              <Plus className="size-4 inline-block align-middle" />
              <span className="mr-2 inline-block align-middle">{t("createContract")}</span>
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-brand-ink">{conversation?.title ?? t("conversation")}</h1>
            <p className="mt-1 text-sm text-brand-muted">{t("chatWithProvider")}</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 rounded-3xl border border-brand-border bg-white px-4 py-3 shadow-sm max-h-64 overflow-y-auto">
          <MessageSquareText className="size-5 text-brand-orange" />
          <div>
            <p className="text-sm font-bold text-brand-ink">{otherParticipant ?? t("unknownParticipant")}</p>
            <p className="text-xs text-brand-muted">{conversation?.updatedAt ? new Date(conversation.updatedAt).toLocaleString() : t("lastActiveUnknown")}</p>
          </div>
        </div>
      </div>

      <PageHeader title={t("messages")} description={t("chatScreenDescription")} />

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-3xl border border-brand-border bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-brand-ink">{t("conversationDetails")}</p>
          <p className="mt-2 text-sm text-brand-muted">{t("conversationParticipants")}</p>
          <div className="mt-4 space-y-2">
            {conversation?.participantIds.map((participant) => {
              const isMe = participant === user?.id;
              const displayName = isMe ? `${user?.firstName ?? user?.name ?? ""} ${user?.lastName ?? ""}`.trim() : (conversation?.otherParticipant?.id === participant ? `${conversation?.otherParticipant?.firstName ?? ""} ${conversation?.otherParticipant?.lastName ?? ""}`.trim() : participant);
              return (
                <div key={participant} className="flex items-center justify-between rounded-3xl border border-brand-border bg-brand-bg px-4 py-3">
                  <span>{displayName || participant}</span>
                  {isMe ? <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[11px] font-bold text-white">{t("you")}</span> : null}
                </div>
              );
            })}
          </div>
        </aside>

        <div className="flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-brand-border bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto p-5 max-h-[520px]">
            {messagesQuery.isLoading ? (
              <div className="flex h-[360px] items-center justify-center text-brand-muted">{t("loadingMessages")}</div>
            ) : !messages.length ? (
              <div className="flex h-[360px] flex-col items-center justify-center gap-3 text-center text-brand-muted">
                <MessageSquareText className="size-9 text-brand-orange" />
                <p>{t("noMessagesYet")}</p>
                <p className="max-w-sm text-sm">{t("sendFirstMessage")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} isSender={message.senderId === user?.id} />
                ))}
                <div ref={messageEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-brand-border bg-brand-bg p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder={t("typeMessage")}
                className="min-h-[56px] flex-1 rounded-3xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none"
              />
              <Button disabled={!messageText.trim() || sendMessageMutation.isPending} className="h-14 rounded-3xl px-6 text-sm">
                <Send className="size-4" />
                {t("send")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
