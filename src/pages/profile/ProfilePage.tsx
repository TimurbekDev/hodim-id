import { Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/requests/Auth/AuthReqeusts";
import PhotoGuidelinesModal from "./components/PhotoGuidelinesModal";
import ProfileForm from "./components/ProfileForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

import backIcon from "@/assets/icons/icon-navbar (1).svg"; 


const ProfilePage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: me, isLoading, isError } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMe(accessToken!),
    enabled: !!accessToken,
  });
  

  return (
    <Card className="home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="relative flex items-center justify-center pt-4 pb-2 border-b border-transparent">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-1 flex items-center justify-center"
          aria-label="Назад"
        >
          <img src={backIcon} alt="Назад" className="w-19 h-19" />
        </button>
        <h1 className="text-[18px] font-medium text-gray-900">Профиль</h1>
      </div>



      {/* MIDDLE */}
      <div className="flex-1 min-h-0 px-4 pb-4 sm:px-5 sm:pb-5 overflow-auto">
        {isLoading && <div className="p-4 text-center text-gray-500">Загрузка…</div>}
        {isError && <div className="p-4 text-center text-red-500">Ошибка загрузки профиля</div>}
        {me && <ProfileForm me={me} onShowExamples={() => setOpen(true)} />}
      </div>

      <PhotoGuidelinesModal open={open} onClose={() => setOpen(false)} />
    </Card>
  );
};

export default ProfilePage;
