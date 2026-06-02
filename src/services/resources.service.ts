import { api } from "./api";
import type { ActivityLog, Contract, Conversation, Equipment, Message, NotificationItem, Payment, Profile, Project, Quote, Review, User } from "@/types/domain";

function matchParticipantIds(source: string[], target: string[]) {
  const normalizedSource = [...source].sort();
  const normalizedTarget = [...target].sort();
  return normalizedSource.length === normalizedTarget.length && normalizedSource.every((value, index) => value === normalizedTarget[index]);
}

async function enrichConversationWithParticipants(conversation: Conversation, currentUserId: string): Promise<Conversation> {
  try {
    const otherParticipantId = conversation.participantIds.find((id) => id !== currentUserId);
    if (!otherParticipantId) return conversation;

    const { data: users } = await api.get<User[]>("/users", { params: { id: otherParticipantId } });
    const otherUser = users[0];

    if (otherUser) {
      return {
        ...conversation,
        otherParticipant: {
          id: otherUser.id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          role: otherUser.role,
          avatarUrl: otherUser.avatarUrl,
          profileImage: otherUser.profileImage
        }
      };
    }
    return conversation;
  } catch {
    return conversation;
  }
}

export const resourcesService = {
  profiles: async () => (await api.get<Profile[]>("/profiles")).data,
  profileByUser: async (userId: string) => {
    const { data } = await api.get<Profile[]>("/profiles", { params: { userId } });
    return data[0] ?? null;
  },
  userById: async (userId: string) => {
    if (!userId) return null;
    const { data } = await api.get<User[]>("/users", { params: { id: userId } });
    return data[0] ?? null;
  },
  createProfile: async (payload: Profile) => (await api.post<Profile>("/profiles", payload)).data,
  updateProfile: async (id: string, payload: Profile) => (await api.put<Profile>(`/profiles/${id}`, payload)).data,
  equipment: async () => (await api.get<Equipment[]>("/equipment")).data,
  equipmentByOwner: async (ownerId: string) => {
    const { data } = await api.get<Equipment[]>("/equipment", { params: { ownerId } });
    return data;
  },
  createEquipment: async (payload: Omit<Equipment, "id">) => (await api.post<Equipment>("/equipment", payload)).data,
  updateEquipment: async (id: string, payload: Partial<Equipment>) => (await api.patch<Equipment>(`/equipment/${id}`, payload)).data,
  projects: async () => (await api.get<Project[]>("/projects")).data,
  projectsByClient: async (clientId: string) => {
    const { data } = await api.get<Project[]>("/projects", { params: { clientId } });
    return data;
  },
  createProject: async (payload: Omit<Project, "id">) => (await api.post<Project>("/projects", payload)).data,
  updateProject: async (id: string, payload: Partial<Project>) => (await api.patch<Project>(`/projects/${id}`, payload)).data,
  conversations: async (userId: string) => {
    const { data } = await api.get<Conversation[]>("/conversations", { params: { participantIds_like: userId } });
    return Promise.all(data.map((conv) => enrichConversationWithParticipants(conv, userId)));
  },
  conversationById: async (conversationId: string, currentUserId?: string) => {
    const conversation = (await api.get<Conversation>(`/conversations/${conversationId}`)).data;
    return currentUserId ? enrichConversationWithParticipants(conversation, currentUserId) : conversation;
  },
  getOrCreateConversation: async (participantIds: string[], title: string, contractId?: string) => {
    const searchParams = new URLSearchParams();
    participantIds.forEach((participantId) => searchParams.append("participantIds_like", participantId));
    if (contractId) searchParams.append("contractId", contractId);

    const { data } = await api.get<Conversation[]>(`/conversations?${searchParams.toString()}`);
    const existing = data.find((conversation) => {
      const sameParticipants = matchParticipantIds(conversation.participantIds, participantIds);
      const sameContract = contractId ? conversation.contractId === contractId : true;
      return sameParticipants && sameContract;
    });
    if (existing) return existing;

    const timestamp = new Date().toISOString();
    return (await api.post<Conversation>("/conversations", {
      participantIds,
      title,
      contractId,
      lastMessage: "",
      unreadCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    })).data;
  },
  updateConversation: async (id: string, payload: Partial<Conversation>) => (await api.patch<Conversation>(`/conversations/${id}`, payload)).data,
  messages: async (conversationId: string) => (await api.get<Message[]>("/messages", { params: { conversationId } })).data,
  sendMessage: async (payload: Omit<Message, "id"> & { conversation: Conversation }) => {
    const { conversation, ...messagePayload } = payload;
    const message = (await api.post<Message>("/messages", messagePayload)).data;
    await api.patch<Conversation>(`/conversations/${payload.conversationId}`, {
      lastMessage: payload.message,
      updatedAt: new Date().toISOString(),
      unreadCount: (payload.conversation.unreadCount ?? 0) + 1
    });
    await api.post<NotificationItem>("/notifications", {
      userId: payload.receiverId,
      type: "message",
      title: payload.conversation.title,
      body: payload.message,
      conversationId: payload.conversationId,
      read: false,
      createdAt: new Date().toISOString()
    });
    return message;
  },
  markMessagesRead: async (messages: Message[], conversationId: string) => {
    await Promise.all(messages.map((message) => api.patch<Message>(`/messages/${message.id}`, { read: true })));
    await api.patch<Conversation>(`/conversations/${conversationId}`, { unreadCount: 0 });
  },
  createMessage: async (payload: Omit<Message, "id">) => (await api.post<Message>("/messages", payload)).data,
  createNotification: async (payload: Omit<NotificationItem, "id">) => (await api.post<NotificationItem>("/notifications", payload)).data,
  notifications: async (userId: string) => (await api.get<NotificationItem[]>("/notifications", { params: { userId } })).data,
  updateNotification: async (id: string, payload: Partial<NotificationItem>) => (await api.patch<NotificationItem>(`/notifications/${id}`, payload)).data,
  quotes: async () => (await api.get<Quote[]>("/quotes")).data,
  createQuote: async (payload: Omit<Quote, "id">) => (await api.post<Quote>("/quotes", payload)).data,
  updateQuote: async (id: string, payload: Partial<Quote>) => (await api.patch<Quote>(`/quotes/${id}`, payload)).data,
  contracts: async () => (await api.get<Contract[]>("/contracts")).data,
  contractById: async (id: string) => (await api.get<Contract>(`/contracts/${id}`)).data,
  createContract: async (payload: Omit<Contract, "id">) => (await api.post<Contract>("/contracts", payload)).data,
  updateContract: async (id: string, payload: Partial<Contract>) => (await api.patch<Contract>(`/contracts/${id}`, payload)).data,
  payments: async () => (await api.get<Payment[]>("/payments")).data,
  createPayment: async (payload: Omit<Payment, "id">) => (await api.post<Payment>("/payments", payload)).data,
  updatePayment: async (id: string, payload: Partial<Payment>) => (await api.patch<Payment>(`/payments/${id}`, payload)).data,
  reviews: async () => (await api.get<Review[]>("/reviews")).data,
  createReview: async (payload: Omit<Review, "id">) => (await api.post<Review>("/reviews", payload)).data,
  activityLogs: async () => (await api.get<ActivityLog[]>("/activityLogs")).data,
  createActivityLog: async (payload: Omit<ActivityLog, "id">) => (await api.post<ActivityLog>("/activityLogs", payload)).data
};
