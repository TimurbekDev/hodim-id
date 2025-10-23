import infoIcon from "@/assets/icons/Union (2).svg";

type Props = { onShowExamples?: () => void };

export default function InfoBanner({ onShowExamples }: Props) {
  return (
    <div className="rounded-lg bg-[rgba(0,123,255,0.12)] p-3 flex gap-2 items-start">
      {/* Custom blue info icon */}
      <div className="shrink-0 mt-0.5">
        <img
          src={infoIcon}
          alt="info"
          className="w-5 h-5" // 20×20px similar to design
        />
      </div>

      {/* Text section */}
      <div
        className="text-[15px] leading-[18px] font-normal tracking-[0.25px] text-gray-900"
        style={{ fontFamily: '"Google Sans", sans-serif' }}
      >
        Лицо на фото должно быть различимым и смотреть на камеру.{" "}
        <button
          type="button"
          onClick={onShowExamples}
          className="underline text-[#007BFF] font-normal"
        >
          Смотреть примеры
        </button>
      </div>
    </div>
  );
}
