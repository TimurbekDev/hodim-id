// src/pages/billing/components/PlanCard.tsx
import type { BillingPlan } from "@/types/billing";

// src/pages/billing/components/PlanCard.tsx
export default function PlanCard({ plan }: { plan: BillingPlan }) {
  if (!plan) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[17px] leading-[22px] font-medium" style={{ color: "#262633" }}>
          {plan.name ?? "—"}
        </div>
        <div className="text-[17px] leading-[22px] font-medium" style={{ color: "#85889E" }}>
          {plan.pricePerMonth ? `${plan.pricePerMonth} ${plan.currency ?? "UZS"} / мес` : "Бесплатно"}
        </div>
      </div>
      {plan.description && (
        <div className="mt-1 text-[13px] leading-[18px] text-gray-600">
          {plan.description}
        </div>
      )}
      {!!(plan.features?.length) && (
        <ul className="mt-2 space-y-1 text-[13px] leading-[18px] text-gray-600">
          {plan.features!.map((f, i) => <li key={i}>• {f}</li>)}
        </ul>
      )}
    </div>
  );
}

