// src/requests/billing.ts
import { api } from "@/api";
import type {
  BillingPlan,
  BillingPlanStatus,
  Invoice,
  AnalyticsEntry,
  AnalyticsParams,
} from "@/types/billing";

const auth = (token?: string) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

// ---- helper backend types ----
interface RawPlan {
  id: number;
  name: string;
  pricePerMonth?: number;
  currency?: string;
  description?: string;
  describtion?: string;
  maxEmployeesInOrganizations?: number;
  maxOrganizations?: number;
  isActive?: boolean;
}

interface RawInvoice {
  id: number;
  invoiceId?: string;
  invoicedId?: string;
  accountNumber: string;
  chargeAmount?: number;
  amount?: number;
  currency?: string;
  createdAt: string;
  status?: "pending" | "paid" | "cancelled";
  balance?: number;
}

interface RawPayment {
  id: number;
  transactionId?: string;
  accountNumber: string;
  amount?: number;
  chargeAmount?: number;
  currency?: string;
  createdAt: string;
  method?: string;
  provider?: string;
  status?: "succeeded" | "failed" | "refunded";
  paymentType?: "send" | "cancel";
  balance?: number;
}

// ---- main requests ----
export async function getBillingPlans(opts?: {
  status?: BillingPlanStatus;
  token?: string;
}) {
  const params: Record<string, string> = {};
  if (opts?.status) params.status = opts.status;

  const { data } = await api.get<{ items: RawPlan[]; totalItems: number }>(
    "/billing/plans",
    { params, ...(auth(opts?.token)) }
  );

  const plans: BillingPlan[] = (data.items ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    maxEmployeesInOrganizations: p.maxEmployeesInOrganizations ?? 0,
    maxOrganizations: p.maxOrganizations ?? 0,
    pricePerMonth: p.pricePerMonth ?? 0,
    currency: p.currency ?? "UZS",
    description: p.describtion ?? p.description ?? "",
    features: [],
    status: p.isActive ? "active" : "inactive",
  }));

  return plans;
}

export async function getAutopay(token?: string) {
  const { data } = await api.get<{ autopay: boolean }>(
    "/billing/autopayment",
    auth(token)
  );
  return !!data.autopay;
}

export async function setAutopay(enable: boolean, token?: string) {
  const { data } = await api.post<{ autopay: boolean }>(
    "billing/autopayment",
    null,
    { ...auth(token), params: { enable } }
  );
  return !!data.autopay;
}

export async function makeInvoice(planId: number, token?: string) {
  const { data } = await api.post<Invoice>(
    `/billing/make-invoice/${planId}`,
    null,
    auth(token)
  );
  return data;
}

export async function getCurrentUserBillingPlan(
  token?: string
): Promise<BillingPlan | null> {
  const { data } = await api.get<{ plan?: RawPlan; autopay?: RawPlan }>(
    "/billing/plan",
    auth(token)
  );

  const p = data.plan ?? data.autopay;
  if (!p) return null;

  const mapped: BillingPlan = {
    id: p.id,
    name: p.name,
    pricePerMonth: p.pricePerMonth ?? 0,
    currency: p.currency ?? "UZS",
    description: p.description ?? p.describtion ?? "",
    maxEmployeesInOrganizations: p.maxEmployeesInOrganizations ?? 0,
    maxOrganizations: p.maxOrganizations ?? 0,
    features: [],
    status: p.isActive ? "active" : "inactive",
  };

  return mapped;
}

export async function getBillingAnalytics(
  params?: AnalyticsParams & { token?: string }
) {
  const { token, ...rest } = params ?? {};
  const { data } = await api.get<{ payments?: RawPayment[]; invoices?: RawInvoice[] }>(
    "/billing/analytics",
    { params: rest, ...(auth(token)) }
  );

  const invoices: AnalyticsEntry[] = (data.invoices ?? []).map((x) => ({
    type: "invoice",
    id: x.id,
    invoiceNumber: x.invoiceId ?? x.invoicedId ?? String(x.id),
    accountNumber: x.accountNumber,
    amount: x.chargeAmount ?? x.amount ?? 0,
    currency: x.currency ?? "UZS",
    createdAt: x.createdAt,
    status: ((): "pending" | "paid" | "cancelled" => {
      if (x.status === "paid") return "paid";
      if (x.status === "cancelled") return "cancelled";
      if (typeof x.balance === "number" && x.balance === 0) return "paid";
      return "pending";
    })(),
  }));

  const payments: AnalyticsEntry[] = (data.payments ?? []).map((x) => {
    const amount = x.amount ?? x.chargeAmount ?? 0;
    const paymentType = x.paymentType;
    const inferredStatus: "succeeded" | "failed" | "refunded" =
      x.status ??
      (paymentType === "cancel"
        ? "failed"
        : amount > 0
        ? "succeeded"
        : "failed");

    return {
      type: "payment",
      id: x.id,
      paymentNumber: x.transactionId ?? String(x.id),
      accountNumber: x.accountNumber,
      amount,
      currency: x.currency ?? "UZS",
      createdAt: x.createdAt,
      method: x.method ?? x.provider ?? undefined,
      paymentType,
      balance: x.balance,
      status: inferredStatus,
    };
  });

  return [...invoices, ...payments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
