// import type { AnalyticsEntry as BillingTxn } from "@/types/billing";

// export default function HistoryList({ items }: { items: BillingTxn[] }) {
//   if (!items.length) {
//     return <div className="text-center text-gray-500 text-sm py-6">Нет записей</div>;
//   }

//   return (
//     <div className="rounded-2xl border border-gray-100 bg-white divide-y">
//       {items.map((tx) => {
//         const isPayment = tx.type === "payment";
//         const title = isPayment ? "Платёж2" : "Счёт";
//         const currency = tx.currency || "UZS";

//         // right-side amount & color: payment = + (increase), invoice = − (decrease)
//         const amountText = isPayment
//           ? `-${tx.amount} ${currency}`
//           : `+${tx.amount} ${currency}`;

//         const amountColor = !isPayment ? "#2c7a7b" /* teal/positive */ : "#85889E" /* neutral/charge */;

//         // secondary line: date • method? • status
//         const dateStr = new Date(tx.createdAt).toLocaleDateString("ru-RU", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         });
//         const methodStr = isPayment && (tx as any).method ? ` • ${(tx as any).method.toUpperCase()}` : "";
//         const statusStr = isPayment
//           ? ((tx as any).status === "succeeded" ? "Успешно" : "Неуспешно")
//           : ((tx as any).status === "paid" ? "Оплачен" : "Ожидает");

//         return (
//           <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
//             <div>
//               <div className="text-[15px] leading-[18px]" style={{ color: "#262633" }}>
//                 {title}
//               </div>
//               <div className="text-[13px] leading-[18px] text-gray-500">
//                 {dateStr}
//                 {methodStr}
//                 {` • ${statusStr}`}
//               </div>
//             </div>

//             <div
//               className="text-[15px] leading-[18px] font-medium"
//               style={{ color: amountColor }}
//             >
//               {amountText}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
