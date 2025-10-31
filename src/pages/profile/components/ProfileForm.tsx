import React, { useEffect, useState, useRef } from "react";
import type { IUserResponse } from "@/types/me";
import InfoBanner from "./InfoBanner";
import { useAuth } from "@/hooks/useAuth";
import editPhoto from "@/assets/icons/camera.svg";
import { getMyAvatarUrl, uploadAvatar } from "@/requests/Client/ClientReqeusts";
import { useQuery } from "@tanstack/react-query";
import Avatar from "@/components/ui/Avatar";

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
  const [, setAvatarUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: myAvatar } = useQuery({
    queryKey: ["my-avatar-url", !!accessToken],
    enabled: !!accessToken,
    staleTime: 60_000,
    queryFn: () => getMyAvatarUrl(accessToken!),
  });

  // Fetch existing avatar URL
  const ran = useRef(false);

  useEffect(() => {
    if (!accessToken || ran.current) return;
    ran.current = true;

    let ignore = false;
    (async () => {
      try {
        const url = await getMyAvatarUrl(accessToken);
        if (!ignore) setAvatarUrl(url ?? undefined);
      } catch { }
    })();
    return () => { ignore = true; };
  }, [accessToken]);


  // Upload avatar

  const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file || !accessToken) return;

    // (optional) instant local preview while uploading
    let revoke = () => { };
    try {
      const blobUrl = URL.createObjectURL(file);
      setAvatarUrl(blobUrl);
      (revoke as any) = () => URL.revokeObjectURL(blobUrl);
    } catch { }

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
      const ok = await uploadAvatar(file, accessToken);
      if (!ok) { console.error("Avatar upload failed"); return; }

      // ⬇️ REFRESH THE PRESIGNED URL + CACHE-BUST
      const fresh = await getMyAvatarUrl(accessToken);
      const busted = fresh
        ? `${fresh}${fresh.includes("?") ? "&" : "?"}t=${Date.now()}`
        : undefined;
      setAvatarUrl(busted);

      // clean up the temporary blob preview
      revoke();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
      // reset input so picking the same file again fires onChange
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();


  return (
    <div className="w-full">
      {/* Avatar */}
      <div className="mt-4 mb-4 flex justify-center">
        <div className="relative w-24 h-24">

          <Avatar
            src={myAvatar}
            backup={me?.image_url}
            alt={me?.full_name}
            size={96}
          />

          {/* Overlay button */}
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading}
            aria-label="Изменить фото"
            className={`absolute -bottom-1 -right-1 bg-white rounded-full shadow w-9 h-9 flex items-center justify-center border border-black/10 ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <img
              src={editPhoto}
              alt=""
              aria-hidden="true"
              className="w-6.3 h-6.3"
              draggable={false}
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
    </div >
  );
};

export default ProfileForm;
