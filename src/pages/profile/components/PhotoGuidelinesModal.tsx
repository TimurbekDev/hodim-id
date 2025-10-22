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
      closable={false} // disable default X button
      className="rounded-3xl overflow-hidden"
      bodyStyle={{ padding: 0 }}
    >
      {/* Custom header */}
      <div className="relative flex items-center justify-center p-4 border-b border-gray-100">
        <button
  onClick={onClose}
  className="absolute left-4 flex items-center justify-center" // no bg, no rounded
  aria-label="Назад"
>
  <img src={backIcon} alt="" className="w-20 h-20" /> {/* 40×40 like Figma */}
</button>

        <h1 className="text-[18px] font-medium text-gray-900">Примеры фото</h1>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3 justify-items-center">
        {examples.map((x, i) => (
          <figure key={i} className="relative flex flex-col items-center text-center w-[160px]">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md">
              <img src={x.img} alt={x.title} className="w-full h-full object-cover" />
              <img
                src={x.ok ? yesIcon : noIcon}
                alt={x.ok ? "yes" : "no"}
                className="absolute top-0 right-0 w-10 h-10"
              />
            </div>
            <figcaption
              className={`mt-1 text-[13px] font-medium ${
                x.ok ? "text-green-600" : "text-red-500"
              }`}
            >
              {x.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </Modal>
  );
}
