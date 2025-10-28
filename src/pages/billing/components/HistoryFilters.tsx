// import { DatePicker, Segmented } from "antd";
// import type { AnalyticsTransactionType as TxnType } from "@/types/billing";
// import dayjs from "dayjs";

// export default function HistoryFilters({
//   type, onType, range, onRange
// }: {
//   type: TxnType | undefined; onType: (t: TxnType | undefined)=>void;
//   range: [string|undefined,string|undefined]; onRange: (r:[string|undefined,string|undefined])=>void;
// }) {
//   const [from,to] = range;

//   return (
//     <div className="rounded-2xl border border-gray-100 bg-white p-3 flex flex-col gap-2">
//       <Segmented
//         block
//         options={[
//           { label: "Все", value: "all" },
//           { label: "Счета", value: "invoice" },
//           { label: "Платежи", value: "payment" },
//         ]}
//         value={type ?? "all"}
//         onChange={(v) => onType(v === "all" ? undefined : (v as TxnType))}
//       />
//       <div className="flex gap-2">
//         <DatePicker
//           className="flex-1"
//           placeholder="с"
//           value={from ? dayjs(from) : undefined}
//           onChange={(d)=> onRange([d ? d.format("YYYY-MM-DD") : undefined, to])}
//         />
//         <DatePicker
//           className="flex-1"
//           placeholder="по"
//           value={to ? dayjs(to) : undefined}
//           onChange={(d)=> onRange([from, d ? d.format("YYYY-MM-DD") : undefined])}
//         />
//       </div>
//     </div>
//   );
// }
