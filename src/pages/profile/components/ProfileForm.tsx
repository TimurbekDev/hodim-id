import React, { useEffect, useState, useRef } from "react";
import type { IUserResponse } from "@/types/me";
import InfoBanner from "./InfoBanner";
import { useAuth } from "@/hooks/useAuth";
import editPhoto from "@/assets/icons/edit-button.svg";
import { getMyAvatarUrl , uploadAvatar} from "@/requests/getMyAvatarUrl";
// import avatarFallback from "@/assets/avatar-fallback.png"; // (Option B) use imported asset

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch existing avatar URL
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!accessToken) return;
      try {
        const url = await getMyAvatarUrl(accessToken);
        if (!ignore) setAvatarUrl(url ?? undefined);
      } catch {/* ignore */ }
    })();
    return () => { ignore = true; };
  }, [accessToken]);

  // Upload avatar
  const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file || !accessToken) return;

    // Client-side validation (mirror server)
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      console.error("Unsupported content type");
      return;
    }
    const maxBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxBytes) {
      console.error("File too large");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const ok = await uploadAvatar(file, accessToken);
      if (!ok) { console.error("Avatar upload failed"); return; }

      // Refresh presigned URL and cache-bust so <img> updates immediately
      const fresh = (await getMyAvatarUrl(accessToken)) ?? undefined;
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
      // reset input value so selecting the same file again will trigger onChange
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const avatar =
    avatarUrl ??
    (me.image_url?.startsWith("http") ? me.image_url : "/img/avatar-fallback.png"); // or avatarFallback

  return (
    <div className="w-full">
      {/* Avatar */}
      <div className="mt-4 mb-4 flex justify-center">
        <div className="relative w-24 h-24">
          <img
            src={avatar}
            alt={fullName}
            className={`w-24 h-24 rounded-full object-cover border transition-opacity ${uploading ? "opacity-60" : "opacity-100"}`}
          />

          {/* Overlay button */}
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading}
            aria-label="Изменить фото"
            className={`absolute -bottom-1 -right-1 bg-white rounded-full shadow w-8 h-8 flex items-center justify-center border border-black/10 ${uploading ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            <span
              className="block w-8 h-8 bg-center bg-no-repeat bg-cover"
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
