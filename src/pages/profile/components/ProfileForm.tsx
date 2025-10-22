import React from "react";
// If you DON'T have the @ alias working, use the relative import below instead.
// import type { IUserResponse } from "../../../types/me";
import type { IUserResponse } from "@/types/me";
import InfoBanner from "./InfoBanner";

type Props = {
  me: IUserResponse;           // data from /client/me
  onShowExamples?: () => void; // open the photo examples modal (optional)
};

/** Small helper to render a grey "pill" row like in Figma */
const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="rounded-2xl bg-[#F3F4F6] px-4 py-3">
    <div className="text-[13px] text-gray-500">{label}</div>
    <div className="text-[17px] leading-6 text-gray-900">{value ?? "—"}</div>
  </div>
);

const ProfileForm: React.FC<Props> = ({ me, onShowExamples }) => {
  const fullName = me.full_name || me.username || "—";
  const position = me.organizationClientViews?.[0]?.position ?? "—";
  const pinfl = me.pinfl ?? "—";

  // If backend returns a key instead of a full URL, swap this mapping.
  const avatar = me.image_url?.startsWith("http")
    ? me.image_url
    : "/images/avatar-placeholder.webp"; // put a placeholder into /public/images if you want

  return (
    <div className="w-full">
      {/* Avatar */}
      <div className="flex justify-center mb-3">
        <img
          src={avatar}
          alt={fullName}
          className="w-28 h-28 rounded-full object-cover border"
        />
      </div>

      {/* Info banner + link to examples (optional) */}
      <div className="mb-3">
  <InfoBanner onShowExamples={onShowExamples} />
</div>


      {/* Read-only fields (grey pills) */}
      <div className="flex flex-col gap-3">
        <Field label="ФИО" value={fullName} />
        <Field label="Должность" value={position} />
        <Field label="ПИНФЛ" value={pinfl} />
      </div>
    </div>
  );
};

export default ProfileForm;
