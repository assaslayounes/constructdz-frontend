import { cn } from "./utils";
import type { Contract, ContractStatus } from "@/types/domain";

export const contractStatusLabel: Record<ContractStatus, string> = {
  draft: "مسودة",
  pending_signature: "بانتظار التوقيع",
  signed: "موقّع",
  completed: "مكتمل",
  cancelled: "ملغى"
};

export function normalizeContractStatus(value?: string | ContractStatus): ContractStatus {
  if (!value) return "draft";
  const normalized = String(value).toLowerCase();
  if (normalized === "pending_signature" || normalized === "pendingsignature" || normalized === "pending signature" || normalized === "pending_signature") {
    return "pending_signature";
  }
  if (normalized === "signed") return "signed";
  if (normalized === "completed") return "completed";
  if (normalized === "cancelled" || normalized === "canceled") return "cancelled";
  return "draft";
}

export function getContractBadgeClass(status: ContractStatus) {
  switch (status) {
    case "pending_signature":
      return cn("rounded-full px-3 py-1 text-xs font-semibold uppercase text-brand-orange bg-brand-orange/10");
    case "signed":
      return cn("rounded-full px-3 py-1 text-xs font-semibold uppercase text-emerald-700 bg-emerald-100");
    case "completed":
      return cn("rounded-full px-3 py-1 text-xs font-semibold uppercase text-brand-blue bg-brand-blue/10");
    case "cancelled":
      return cn("rounded-full px-3 py-1 text-xs font-semibold uppercase text-red-700 bg-red-100");
    default:
      return cn("rounded-full px-3 py-1 text-xs font-semibold uppercase text-brand-ink bg-brand-border/50");
  }
}

export function getContractTimeline(status: ContractStatus) {
  const steps = [
    { label: "إنشاء العقد", completed: status !== "draft" },
    { label: "توقيع الطرف الأول", completed: status === "signed" || status === "completed" },
    { label: "توقيع الطرف الثاني", completed: status === "signed" || status === "completed" },
    { label: "اعتماد العقد", completed: status === "signed" || status === "completed" }
  ];
  return steps;
}

export function isRelatedToContract(contract: Contract, userId: string | undefined) {
  if (!contract || !userId) return false;
  return [contract.clientId, contract.providerId, ...(contract.signatures?.map((sig) => sig.userId) ?? [])].includes(userId);
}

export function getSignatureLabel(role: string) {
  if (role === "project_owner") return "صاحب المشروع";
  if (role === "service_provider") return "مقدم الخدمة";
  if (role === "equipment_owner") return "مالك المعدة";
  return "طرف العقد";
}
