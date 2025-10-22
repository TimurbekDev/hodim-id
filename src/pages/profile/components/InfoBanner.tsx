import { InfoCircleOutlined } from "@ant-design/icons";

type Props = { onShowExamples?: () => void };

export default function InfoBanner({ onShowExamples }: Props) {
  return (
    <div className="rounded-lg bg-[rgba(0,123,255,0.12)] p-3 flex gap-2 items-start">
      <div className="shrink-0 mt-0.5">
        <InfoCircleOutlined />
      </div>
      <div className="text-[14px] leading-[20px]">
        Лицо на фото должно быть различимым и смотреть на камеру.{" "}
        {/* Use a button styled like a link; no dead href="#" */}
        <button
          type="button"
          onClick={onShowExamples}
          className="underline text-blue-600"
        >
          Смотреть примеры
        </button>
      </div>
    </div>
  );
}
