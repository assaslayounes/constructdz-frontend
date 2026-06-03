import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, FileCheck2, ShieldCheck, Printer } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { resourcesService } from "@/services/resources.service";
import { contractStatusLabel, getContractBadgeClass, getContractTimeline, getSignatureLabel, isRelatedToContract, normalizeContractStatus } from "@/lib/contract";
import type { Contract, ContractStatus } from "@/types/domain";

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ar-DZ", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function ContractDetailPage() {
  const { contractId } = useParams();
  const { user } = useAuthState();
  const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["contract", contractId],
    queryFn: () => resourcesService.contractById(contractId ?? ""),
    enabled: Boolean(contractId)
  });

  const contract = query.data;
  const clientProfileQuery = useQuery({
    queryKey: ["profile", contract?.clientId],
    queryFn: () => resourcesService.profileByUser(contract?.clientId ?? ""),
    enabled: Boolean(contract?.clientId)
  });

  const providerProfileQuery = useQuery({
    queryKey: ["profile", contract?.providerId],
    queryFn: () => resourcesService.profileByUser(contract?.providerId ?? ""),
    enabled: Boolean(contract?.providerId)
  });

  const clientUserQuery = useQuery({
    queryKey: ["user", contract?.clientId],
    queryFn: () => resourcesService.userById(contract?.clientId ?? ""),
    enabled: Boolean(contract?.clientId)
  });

  const providerUserQuery = useQuery({
    queryKey: ["user", contract?.providerId],
    queryFn: () => resourcesService.userById(contract?.providerId ?? ""),
    enabled: Boolean(contract?.providerId)
  });
  const status = normalizeContractStatus(contract?.contractStatus ?? contract?.status);
  const isRelated = isRelatedToContract(contract as Contract, user?.id);
  const userSignature = contract?.signatures.find((signature) => signature.userId === user?.id);
  const alreadySigned = Boolean(userSignature?.approved);
  const isClient = contract?.clientId === user?.id;
  const isProvider = contract?.providerId === user?.id;
  const displayName = user?.firstName ?? user?.name ?? "المستخدم";

  const signRole = useMemo(() => {
    if (isClient) return "project_owner" as const;
    if (isProvider) return "service_provider" as const;
    return "service_provider" as const;
  }, [isClient, isProvider]);

  const canSign = Boolean(
    contract &&
      isRelated &&
      !alreadySigned &&
      status !== "signed" &&
      status !== "completed" &&
      status !== "cancelled"
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (!contract || !user) {
        throw new Error("غير متوفر بيانات العقد أو المستخدم");
      }
      const now = new Date().toISOString();
      const existingSignatures = contract.signatures ? [...contract.signatures] : [];
      const currentSignatureIndex = existingSignatures.findIndex((signature) => signature.userId === user.id);
      const updatedSignatures = [...existingSignatures];

      if (currentSignatureIndex >= 0) {
        updatedSignatures[currentSignatureIndex] = {
          ...existingSignatures[currentSignatureIndex],
          approved: true,
          signedAt: now
        };
      } else {
        updatedSignatures.push({
          userId: user.id,
          role: signRole,
          approved: true,
          signedAt: now
        });
      }

      const partnerSigned = updatedSignatures.some((signature) => signature.role !== signRole && signature.approved);
      const nextStatus: ContractStatus = partnerSigned ? "signed" : "pending_signature";
      const nextHistory = [
        ...(contract.history ?? []),
        `${displayName} ${isClient ? "وافق على" : "وقّع"} العقد (${formatDate(now)})`
      ];

      return resourcesService.updateContract(contract.id, {
        signatures: updatedSignatures,
        contractStatus: nextStatus,
        status: nextStatus,
        history: nextHistory,
        updatedAt: now
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("تم تحديث حالة العقد بنجاح");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء توقيع العقد");
    }
  });

  const partnerSigned = Boolean(contract?.signatures.some((signature) => signature.userId !== user?.id && signature.approved));
  const canEdit = Boolean(
    contract &&
      isRelated &&
      (isClient || isProvider) &&
      !partnerSigned &&
      status !== "signed" &&
      status !== "completed" &&
      status !== "cancelled"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editServiceType, setEditServiceType] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editTotalPrice, setEditTotalPrice] = useState<number | string>("");
  const [editPaymentTerms, setEditPaymentTerms] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    if (!contract) return;
    setEditServiceType(contract.serviceType ?? "");
    setEditDuration(contract.duration ?? "");
    setEditTotalPrice(contract.totalPrice ?? "");
    setEditPaymentTerms(contract.paymentTerms ?? "");
    setEditNote(contract.note ?? "");
  }, [contract]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<typeof contract>) => {
      if (!contract) throw new Error("لا يوجد عقد للتحديث");
      if (!(isClient || isProvider)) throw new Error("ليس لديك صلاحية تعديل العقد");
      if (partnerSigned) throw new Error("لا يمكن تعديل العقد بعد توقيع الطرف الآخر");
      return resourcesService.updateContract(contract.id, payload as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success(t("editContractSuccess"));
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : t("editContractError"));
    }
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!contract) throw new Error("لا يوجد عقد لإتمامه");
      return resourcesService.updateContract(contract.id, { contractStatus: "completed", status: "completed", updatedAt: new Date().toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("تم اعتماد العقد");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "فشل اعتماد العقد");
    }
  });

  if (query.isLoading) {
    return (
      <section className="content-container py-8">
        <PageHeader title="جاري التحميل" description="فضلاً انتظر قليلاً حتى يتم جلب بيانات العقد." />
      </section>
    );
  }

  if (!contract) {
    return (
      <section className="content-container py-8">
        <PageHeader title="العقد غير موجود" description="تأكد من أن معرف العقد صحيح أو أن لديك صلاحية الوصول إليه." />
        <div className="rounded-lg border border-brand-border bg-white p-6 text-center">
          <p className="text-sm text-brand-muted">لا يمكن عرض تفاصيل العقد في هذه اللحظة.</p>
          <Button className="mt-4" onClick={() => navigate("/contracts")}>العودة إلى العقود</Button>
        </div>
      </section>
    );
  }

  if (!isRelated) {
    return (
      <section className="content-container py-8">
        <PageHeader title="غير مصرح" description="ليس لديك صلاحية عرض هذا العقد." />
        <div className="rounded-lg border border-brand-border bg-white p-6 text-center">
          <p className="text-sm text-brand-muted">هذا العقد يخص طرفاً آخر، ولا يمكن الاطلاع عليه.</p>
          <Button className="mt-4" onClick={() => navigate("/contracts")}>العودة إلى العقود</Button>
        </div>
      </section>
    );
  }

  const clientSigned = Boolean(contract?.signatures.some((s) => s.role === "project_owner" && s.approved));
  const providerSignedFlag = Boolean(contract?.signatures.some((s) => s.role === "service_provider" && s.approved));
  const createdStep = Boolean(contract?.createdAt);
  const approvedStep = status === "completed" || status === "signed" || (clientSigned && providerSignedFlag);
  const timeline = [
    { label: "إنشاء العقد", completed: createdStep },
    { label: "توقيع الطرف الأول", completed: clientSigned || approvedStep },
    { label: "توقيع الطرف الثاني", completed: providerSignedFlag || approvedStep },
    { label: "اعتماد العقد", completed: status === "completed" }
  ];

  return (
    <section className="content-container py-8">
      {/* Printable contract section — this will be the only visible area when printing */}
      <div id="contract-print" className="hidden print:block">
          <div className="bg-white p-8 text-black">
          <h1 className="text-xl font-bold">عقد تقديم خدمة / تأجير معدات</h1>
          <p className="mt-2">منصة إنجاز 24 (Injaz24)</p>
          <p className="mt-4 font-semibold">عقد اتفاق رقم: {contract.id}</p>
          <p className="mt-2">تاريخ الإنشاء: {formatDate(contract.createdAt)}</p>
          <p className="mt-2">حالة العقد: {status === "pending_signature" ? "🟡 في انتظار التوقيع" : contractStatusLabel[status]}</p>

          <hr className="my-4" />

          <h2 className="text-lg font-bold">1. بيانات الأطراف</h2>
          <div className="mt-2">
            <h3 className="font-semibold">الطرف الأول (صاحب المشروع)</h3>
            <p>الاسم الكامل: {clientUserQuery.data ? `${clientUserQuery.data.firstName ?? ""} ${clientUserQuery.data.lastName ?? ""}`.trim() : clientProfileQuery.data?.companyName ?? contract.clientId}</p>
            <p>رقم الهاتف: {clientUserQuery.data?.phone ?? clientProfileQuery.data?.userId ?? "-"}</p>
            <p>الولاية: {clientProfileQuery.data?.city ?? "-"}</p>
            <p>البريد الإلكتروني: {clientUserQuery.data?.email ?? "-"}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">الطرف الثاني (مزود الخدمة)</h3>
            <p>الاسم الكامل: {providerUserQuery.data ? `${providerUserQuery.data.firstName ?? ""} ${providerUserQuery.data.lastName ?? ""}`.trim() : providerProfileQuery.data?.companyName ?? contract.providerId}</p>
            <p>رقم الهاتف: {providerUserQuery.data?.phone ?? providerProfileQuery.data?.userId ?? "-"}</p>
            <p>الولاية: {providerProfileQuery.data?.city ?? "-"}</p>
            <p>البريد الإلكتروني: {providerUserQuery.data?.email ?? "-"}</p>
          </div>

          <hr className="my-4" />

          <h2 className="text-lg font-bold">موضوع العقد</h2>
          <p className="mt-2">اتفق الطرفان على قيام الطرف الثاني بتوفير {contract.serviceType} لصالح الطرف الأول وفق الشروط والأحكام المحددة في هذا العقد.</p>
          <ul className="mt-3 list-disc pl-6">
            <li>نوع الخدمة: {contract.serviceType}</li>
            <li>موقع العمل: {contract.note ?? "-"}</li>
            <li>مدة الاستغلال: {contract.duration}</li>
            <li>تاريخ البداية والنهاية: {formatDate(contract.createdAt)} - {contract.updatedAt ? formatDate(contract.updatedAt) : "-"}</li>
            <li>القيمة الإجمالية: {contract.totalPrice?.toLocaleString("ar-DZ") ?? "-"} دج</li>
            <li>الدفعة المقدمة: {"-"}</li>
            <li>الباقي عند إنتهاء الأشغال: {"-"}</li>
          </ul>

          <hr className="my-4" />

          <h2 className="text-lg font-bold">5. التزامات الطرف الأول (صاحب المشروع)</h2>
          <ul className="mt-2 list-none">
            <li>✅ توفير موقع العمل في الموعد المحدد.</li>
            <li>✅ تقديم وصف دقيق لطبيعة الأشغال.</li>
            <li>✅ التصريح بأي عوائق أو مخاطر معروفة في موقع العمل.</li>
            <li>✅ دفع المستحقات المالية في الآجال المتفق عليها.</li>
            <li>✅ احترام شروط السلامة داخل موقع المشروع.</li>
          </ul>

          <h2 className="text-lg font-bold mt-4">6. التزامات الطرف الثاني (مزود الخدمة)</h2>
          <ul className="mt-2 list-none">
            <li>✅ توفير المعدة بالحالة التشغيلية المناسبة.</li>
            <li>✅ الالتزام بمواعيد الحضور والإنجاز.</li>
            <li>✅ تنفيذ العمل وفق المعايير المهنية المتعارف عليها.</li>
            <li>✅ احترام تعليمات السلامة والأمن.</li>
            <li>✅ إعلام الطرف الأول بأي ظرف قد يؤثر على تنفيذ الخدمة.</li>
          </ul>

          <h2 className="text-lg font-bold mt-4">7. حالات التأخير أو الإلغاء</h2>
          <p className="mt-2">في حالة تأخر الطرف الثاني عن الموعد المتفق عليه دون إشعار مسبق، يحق للطرف الأول طلب إلغاء العقد واسترجاع أي مبالغ مدفوعة وفق سياسة المنصة.</p>
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
          <PageHeader title="تفاصيل العقد" description="اطلع على حالة العقد، تفاصيل الخدمة، شروط الدفع، والتوقيعات من الطرفين." />
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-brand-muted">
            <Link to="/contracts" className="text-brand-orange underline">عودة إلى قائمة العقود</Link>
            <span className="text-brand-muted">/</span>
            <span>رقم العقد: {contract.id}</span>
          </div>
        </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-11 rounded-full px-4 text-sm" onClick={() => window.print()}>
                <Printer className="size-4 inline-block align-middle" />
                <span className="mr-2 inline-block align-middle">{t("printContract")}</span>
              </Button>
              <span className={getContractBadgeClass(status)}>{contractStatusLabel[status]}</span>
            </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-4">
          <article className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
            {isEditing ? (
              <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ serviceType: editServiceType, duration: editDuration, totalPrice: Number(editTotalPrice), paymentTerms: editPaymentTerms, note: editNote, updatedAt: new Date().toISOString() }); }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-brand-muted">خلاصة العقد (تعديل)</p>
                    <input value={editServiceType} onChange={(e) => setEditServiceType(e.target.value)} className="mt-2 block w-full rounded-md border border-brand-border px-3 py-2 text-lg" />
                  </div>
                  <div className="rounded-2xl bg-brand-bg px-3 py-2 text-xs font-semibold text-brand-ink">{formatDate(contract.createdAt)}</div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-brand-bg p-4">
                    <p className="text-xs uppercase text-brand-muted">مدة التنفيذ</p>
                    <input value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className="mt-2 block w-full rounded-md border border-brand-border px-3 py-2 text-lg" />
                  </div>
                  <div className="rounded-3xl bg-brand-bg p-4">
                    <p className="text-xs uppercase text-brand-muted">السعر الإجمالي</p>
                    <input value={editTotalPrice} onChange={(e) => setEditTotalPrice(e.target.value)} type="number" className="mt-2 block w-full rounded-md border border-brand-border px-3 py-2 text-lg" />
                  </div>
                  <div className="rounded-3xl bg-brand-bg p-4 sm:col-span-2">
                    <p className="text-xs uppercase text-brand-muted">شروط الدفع</p>
                    <input value={editPaymentTerms} onChange={(e) => setEditPaymentTerms(e.target.value)} className="mt-2 block w-full rounded-md border border-brand-border px-3 py-2 text-lg" />
                  </div>
                  <div className="rounded-3xl bg-brand-bg p-4 sm:col-span-2">
                    <p className="text-xs uppercase text-brand-muted">ملاحظة / موقع العمل</p>
                    <input value={editNote} onChange={(e) => setEditNote(e.target.value)} className="mt-2 block w-full rounded-md border border-brand-border px-3 py-2 text-lg" />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button type="submit" className="rounded-3xl bg-brand-brown py-3 px-6">{t("save")}</Button>
                  <Button type="button" variant="outline" className="rounded-3xl py-3 px-6" onClick={() => { setIsEditing(false); /* reset to contract values */ setEditServiceType(contract.serviceType ?? ""); setEditDuration(contract.duration ?? ""); setEditTotalPrice(contract.totalPrice ?? ""); setEditPaymentTerms(contract.paymentTerms ?? ""); setEditNote(contract.note ?? ""); }}>{t("cancel")}</Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-brand-muted">خلاصة العقد</p>
                    <h2 className="mt-2 text-xl font-bold">{contract.title}</h2>
                  </div>
                  <div className="rounded-2xl bg-brand-bg px-3 py-2 text-xs font-semibold text-brand-ink">{formatDate(contract.createdAt)}</div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-brand-bg p-4">
                    <p className="text-xs uppercase text-brand-muted">نوع الخدمة</p>
                    <p className="mt-2 text-lg font-semibold">{contract.serviceType}</p>
                  </div>
                  <div className="rounded-3xl bg-brand-bg p-4">
                    <p className="text-xs uppercase text-brand-muted">مدة التنفيذ</p>
                    <p className="mt-2 text-lg font-semibold">{contract.duration}</p>
                  </div>
                  <div className="rounded-3xl bg-brand-bg p-4">
                    <p className="text-xs uppercase text-brand-muted">السعر الإجمالي</p>
                    <p className="mt-2 text-lg font-semibold">{contract.totalPrice.toLocaleString("ar-DZ")} دج</p>
                  </div>
                  <div className="rounded-3xl bg-brand-bg p-4">
                    <p className="text-xs uppercase text-brand-muted">حالة العقد</p>
                    <p className="mt-2 text-lg font-semibold">{contractStatusLabel[status]}</p>
                  </div>
                </div>
                <div className="mt-4">
                  {canEdit && (
                    <Button variant="outline" className="rounded-3xl py-3 px-6" onClick={() => setIsEditing(true)}>{t("editContract")}</Button>
                  )}
                  {!canEdit && isRelated && (
                    <p className="text-sm text-brand-muted">لا يحق لك تعديل العقد بعد توقيع الطرف الآخر أو ليس لديك صلاحية التعديل.</p>
                  )}
                </div>
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">تفاصيل الخدمة</h3>
            <p className="mt-3 text-sm leading-7 text-brand-muted">{contract.paymentTerms}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-brand-bg p-4">
                <p className="text-xs uppercase text-brand-muted">شروط الدفع</p>
                <p className="mt-2 text-sm leading-7">{contract.paymentTerms}</p>
              </div>
              <div className="rounded-3xl bg-brand-bg p-4">
                <p className="text-xs uppercase text-brand-muted">المسؤوليات</p>
                <div className="mt-2 space-y-2">
                  {contract.responsibilities?.map((item, index) => (
                    <div key={index} className="rounded-2xl bg-white p-3 shadow-sm">
                      <p className="text-sm font-semibold">{getSignatureLabel(item.party)}</p>
                      <p className="mt-1 text-sm text-brand-muted">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">حالة التوقيع</h3>
                <p className="mt-2 text-sm text-brand-muted">سجل توقيع كل طرف وتاريخ الاعتماد.</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
                <ShieldCheck className="size-5 text-brand-orange" />
                توقيع آمن
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {contract.signatures.map((signature) => (
                <div key={signature.userId} className="rounded-3xl border border-brand-border bg-brand-bg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{getSignatureLabel(signature.role)}</p>
                      <p className="text-xs text-brand-muted">{signature.userId === contract.clientId ? "صاحب المشروع" : "مقدم الخدمة"}</p>
                    </div>
                    <span className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold uppercase",
                      signature.approved ? "bg-emerald-100 text-emerald-700" : "bg-brand-border/70 text-brand-ink"
                    )}>
                      {signature.approved ? "موقّع" : "بانتظار"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-brand-muted">{signature.signedAt ? formatDate(signature.signedAt) : "لم يتم التوقيع بعد"}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileCheck2 className="size-5 text-brand-orange" />
              <div>
                <p className="text-sm font-semibold">{contract.title}</p>
                <p className="text-sm text-brand-muted">تفاصيل العقد ومحاور التوقيع</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
                  <div className="rounded-3xl bg-brand-bg p-4">
                    <p className="text-xs uppercase text-brand-muted">الطرف الأول</p>
                    <p className="mt-2 text-sm font-semibold">{clientUserQuery.data ? `${clientUserQuery.data.firstName ?? ""} ${clientUserQuery.data.lastName ?? ""}`.trim() : contract.clientId}</p>
                    <p className="text-xs text-brand-muted">{clientUserQuery.data?.phone ?? ""}</p>
                  </div>
                  <div className="rounded-3xl bg-brand-bg p-4">
                    <p className="text-xs uppercase text-brand-muted">الطرف الثاني</p>
                    <p className="mt-2 text-sm font-semibold">{providerUserQuery.data ? `${providerUserQuery.data.firstName ?? ""} ${providerUserQuery.data.lastName ?? ""}`.trim() : contract.providerId}</p>
                    <p className="text-xs text-brand-muted">{providerUserQuery.data?.phone ?? ""}</p>
                  </div>
              <div className="rounded-3xl bg-brand-bg p-4">
                <p className="text-xs uppercase text-brand-muted">آخر تحديث</p>
                <p className="mt-2 text-sm font-semibold">{formatDate(contract.updatedAt ?? contract.createdAt)}</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">مراحل العقد</h3>
            <div className="mt-5 space-y-4">
              {timeline.map((step, index) => (
                <div key={step.label} className="flex items-start gap-3">
                  <span className={cn(
                    "mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    step.completed ? "bg-emerald-100 text-emerald-700" : "bg-brand-border/70 text-brand-ink"
                  )}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.label}</p>
                    <p className="text-sm text-brand-muted">{step.completed ? "مكتمل" : "غير مكتمل"}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">الإجراء التالي</h3>
                <p className="mt-2 text-sm text-brand-muted">يمكنك توقيع العقد بعد التأكد من الشروط.</p>
              </div>
              <CheckCircle2 className="size-5 text-brand-blue" />
            </div>
            <div className="mt-6">
              {alreadySigned ? (
                <div className="rounded-3xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">تم توقيعك بالفعل</div>
              ) : canSign ? (
                <Button className="w-full rounded-3xl py-4" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                  {isClient ? "موافق على العقد" : "توقيع العقد"}
                </Button>
              ) : clientSigned && providerSignedFlag && status !== "completed" ? (
                <Button className="w-full rounded-3xl py-4 bg-brand-blue text-white" onClick={() => completeMutation.mutate()} disabled={completeMutation.isPending}>
                  اعتماد العقد
                </Button>
              ) : (
                <div className="rounded-3xl bg-brand-bg p-4 text-sm text-brand-muted">الرجاء مراجعة حالة العقد أو التأكد من أنك طرف مرتبط بهذا العقد.</div>
              )}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
