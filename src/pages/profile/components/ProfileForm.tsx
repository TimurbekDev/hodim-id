import React, { useEffect, useState, useRef } from "react";
import type { IUserResponse } from "@/types/me";
import InfoBanner from "./InfoBanner";
import { useAuth } from "@/hooks/useAuth";
import editPhoto from "@/assets/icons/edit-button.svg";

type Props = {
  me: IUserResponse;
  onShowExamples?: () => void;
};

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-2xl bg-[#F3F4F6] px-4 py-3">
    <div className="text-[13px] text-gray-500">{label}</div>
    <div className="text-[17px] leading-6 text-gray-900">{value ?? "—"}</div>
  </div>
);

const ProfileForm: React.FC<Props> = ({ me, onShowExamples }) => {
  const fullName = me.full_name || me.username || "—";
  const position = me.organizationClientViews?.[0]?.position ?? "—";
  const pinfl = me.pinfl ?? "—";

  const { accessToken } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch existing avatar URL
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!accessToken) return;
      const res = await fetch("/api/client/avatar/url", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const { url } = await res.json();
      if (!ignore) setAvatarUrl(url ?? undefined);
    })();
    return () => { ignore = true; };
  }, [accessToken]);

  // Upload avatar
  const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file || !accessToken) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/client/avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    if (!res.ok) {
      console.error("Avatar upload failed");
      return;
    }

    // Refresh new URL (presigned)
    const refresh = await fetch("/api/client/avatar/url", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (refresh.ok) {
      const { url } = await refresh.json();
      setAvatarUrl(url ?? undefined);
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const avatar =
    avatarUrl ??
    (me.image_url?.startsWith("http") ? me.image_url : "/img/avatar-fallback.png");

  return (
    <div className="w-full">
      {/* Avatar */}
      <div className="mt-4 mb-4 flex justify-center">
        <div className="relative w-24 h-24">
          <img
            src={avatar}
            alt={fullName}
            className="w-24 h-24 rounded-full object-cover border"
          />

          {/* Overlay button */}
          <button
            type="button"
            onClick={openFileDialog}
            className="absolute -bottom-1 -right-1 bg-white rounded-full shadow w-8 h-8 flex items-center justify-center border border-black/10"
          >
            <span
              className="block w-8 h-8 bg-center bg-no-repeat bg-contain scale-150"
              style={{ backgroundImage: `url(${editPhoto})` }}
            />
          </button>




          {/* Hidden file input */}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Info banner + link to examples (optional) */}
      <div className="mb-5">
        <InfoBanner onShowExamples={onShowExamples} />
      </div>

      {/* Read-only fields */}
      <div className="flex flex-col gap-3">
        <Field label="ФИО" value={fullName} />
        <Field label="Должность" value={position} />
        <Field label="ПИНФЛ" value={pinfl} />
      </div>
    </div>
  );
};

export default ProfileForm;
