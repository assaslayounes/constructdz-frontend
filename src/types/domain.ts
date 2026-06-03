export type AccountType = "owner" | "provider" | "service_provider" | "equipment_owner" | "project_owner" | "admin";
export type RegisterStep = 1 | 2 | 3 | 4;
export type QuoteStatus = "draft" | "pending" | "accepted" | "rejected" | "completed";
export type ContractStatus = "draft" | "pending_signature" | "signed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "completed" | "failed";
export type ExecutionStatus = "not_started" | "in_progress" | "completed" | "cancelled";
export type NotificationType = "message" | "quote" | "contract" | "payment" | "review" | "project";

export type ContractSignatureRole = "project_owner" | "service_provider" | "equipment_owner";

export interface ContractSignature {
  userId: string;
  role: ContractSignatureRole;
  approved: boolean;
  signedAt?: string;
}

export interface ContractResponsibility {
  party: "project_owner" | "service_provider";
  description: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: AccountType;
  token?: string;
  avatarUrl?: string;
  profileImage?: string;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  experienceYears?: number;
  companyName: string;
  city: string;
  avatarUrl?: string;
  profileImage?: string;
  rating?: number;
  reviewsCount?: number;
  services?: string[];
  profession?: string;
  priceFrom?: number;
  portfolioImages?: string[];
}

export interface Equipment {
  id: string;
  ownerId?: string;
  title?: string;
  name?: string;
  category: string;
  description?: string;
  pricePerDay?: number;
  wilaya?: string;
  images?: string[];
  imageUrl?: string;
  available: boolean;
  createdAt?: string;
  rating?: number;
  status?: "available" | "reserved" | "maintenance" | "hidden";
}

export interface Project {
  id: string;
  clientId?: string;
  title: string;
  description?: string;
  wilaya?: string;
  landType?: string;
  budget?: number;
  location: string;
  ownerId: string;
  status: "draft" | "active" | "completed" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  budgetMin?: number;
  budgetMax?: number;
  images?: string[];
  progress?: number;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  title: string;
  lastMessage: string;
  unreadCount: number;
  contractId?: string;
  isOnline?: boolean;
  updatedAt: string;
  otherParticipant?: {
    id: string;
    firstName?: string;
    lastName?: string;
    role?: AccountType;
    avatarUrl?: string;
    profileImage?: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Quote {
  id: string;
  projectId?: string;
  requesterId: string;
  providerId: string;
  title: string;
  amount: number;
  status: QuoteStatus;
  createdAt: string;
}

export interface Contract {
  id: string;
  quoteId?: string;
  projectId?: string;
  title: string;
  serviceType: string;
  duration: string;
  totalPrice: number;
  paymentTerms: string;
  responsibilities: ContractResponsibility[];
  clientId: string;
  providerId: string;
  contractStatus: ContractStatus;
  status?: ContractStatus;
  signatures: ContractSignature[];
  history?: string[];
  createdAt: string;
  updatedAt?: string;
  note?: string;
}

export interface Payment {
  id: string;
  contractId?: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  logs: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  targetId: string;
  authorId: string;
  quality: number;
  communication: number;
  timeliness: number;
  pricing: number;
  professionalism: number;
  comment?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  conversationId?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  createdAt: string;
}
