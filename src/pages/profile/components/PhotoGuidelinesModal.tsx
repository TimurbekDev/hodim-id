import { Modal } from "antd";
import yesIcon from "@/assets/icons/check.svg";
import noIcon from "@/assets/icons/cross.svg";
import backIcon from "@/assets/icons/icon-navbar.svg";

import photo1 from "@/assets/icons/example-photo-01.svg";
import photo2 from "@/assets/icons/example-photo-02.svg";
import photo3 from "@/assets/icons/example-photo-03.svg";
import photo4 from "@/assets/icons/example-photo-04.svg";
import photo5 from "@/assets/icons/example-photo-05.svg";
import photo6 from "@/assets/icons/example-photo-06.svg";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PhotoGuidelinesModal({ open, onClose }: Props) {
  const examples = [
    { ok: true, title: "Фото для документов", img: photo1 },
    { ok: true, title: "Фото с прямым взглядом на камеру", img: photo2 },
    { ok: false, title: "Лицо не видно полностью", img: photo3 },
    { ok: false, title: "Групповые фото", img: photo4 },
    { ok: false, title: "Маски и фильтры", img: photo5 },
    { ok: false, title: "Фото предметов или где нет лица", img: photo6 },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      centered
      closable={false}
      forceRender          // ✅ pre-mount content to avoid first-open lag
      rootClassName="photo-guidelines-modal rounded-3xl overflow-hidden"  // ✅ wrapper class
      styles={{ body: { padding: 0 } }}                                   // ✅ v5 way
    >
      {/* header */}
      <div className="relative flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute left-1 flex items-center justify-center"
          aria-label="Назад"
        >
          <img src={backIcon} alt="" className="w-20 h-20" /> {/* 40×40 */}
        </button>
        <h1 className="text-[18px] font-medium text-gray-900">Примеры фото</h1>
      </div>

      {/* grid */}
      <div className="p-4 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 justify-items-center">
        {examples.map((x, i) => (
          <figure key={i} className="relative flex flex-col items-center text-center w-full max-w-[160px] sm:max-w-[180px]">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md">
              <img
                src={x.img}
                alt={x.title}
                className="w-full h-full object-cover"
                loading="lazy"         // ✅ faster first paint
                decoding="async"
              />
              <img
                src={x.ok ? yesIcon : noIcon}
                alt={x.ok ? "yes" : "no"}
                className="absolute top-0 right-0 w-10 h-10"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className={`mt-1 text-[13px] font-medium ${x.ok ? "text-green-600" : "text-red-500"}`}>
              {x.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </Modal>
  );
}
