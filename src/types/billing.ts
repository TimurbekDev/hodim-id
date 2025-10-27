// src/types/billing.ts
export type BillingPlanStatus = "active" | "inactive" | "all";

export interface BillingPlan {
  id: number;
  name: string;
  pricePerMonth: number;
  maxEmployeesInOrganizations: number;
  maxOrganizations: number;
  currency?: string;
  description?: string;
  features?: string[];
  status: "active" | "inactive";
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  planId: number;
  planName: string;
  amount: number;
  currency?: string;
  issuedAt: string;
  dueAt?: string;
  status: "pending" | "paid" | "cancelled";
  pdfUrl?: string;
}

export type AnalyticsTransactionType = "invoice" | "payment";

export interface AnalyticsInvoice {
  type: "invoice";
  id: number;
  invoiceNumber: string;
  accountNumber: string;
  amount: number;
  currency?: string;
  createdAt: string;
  status: "pending" | "paid" | "cancelled";
}

export interface AnalyticsPayment {
  type: "payment";
  id: number;
  paymentNumber: string;
  accountNumber: string;
  amount: number;
  currency?: string;
  createdAt: string;
  method?: string;
  status: "succeeded" | "failed" | "refunded";
  paymentType?: "send" | "cancel";   // ✅ add this
  balance?: number;            
}

export type AnalyticsEntry = AnalyticsInvoice | AnalyticsPayment;

export interface AnalyticsParams {
  accountNumber?: "all" | string;
  transactionType?: AnalyticsTransactionType;
  from?: string;
  to?: string;
}
