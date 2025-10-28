// import { Modal } from "antd";
// import type { BillingPlan } from "@/types/billing";
// import PlanCard from "./PlanCard";

// export default function PlanPickerModal({
//   open, onClose, plans, onSelect
// }: {
//   open: boolean; onClose: ()=>void;
//   plans: BillingPlan[]; onSelect: (id:number)=>void;
// }) {
//   return (
//     <Modal open={open} onCancel={onClose} footer={null} title="Тарифы" width={420} centered>
//       <div className="grid grid-cols-1 gap-3">
//         {plans.map(p => (
//           <button key={p.id} className="text-left" onClick={()=> onSelect(p.id)}>
//             <PlanCard plan={p} />
//           </button>
//         ))}
//       </div>
//     </Modal>
//   );
// }
