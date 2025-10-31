
import avatarFallback from "@/assets/icons/avatar-fallback.png";

type Props = {
    src?: string | null;
    backup?: string | null;   // from me.image_url
    size?: number;
    alt: string;
    className?: string;
};

export default function Avatar({
    src,
    backup,
    size = 48,
    alt,
    className,
}: Props) {
    const final = src?.trim() || backup?.trim() || avatarFallback;

    return (
        <img
            src={final}
            alt={alt}
            className={[
                "object-cover rounded-full border",
                className || "",
            ].join(" ")}
            style={{ width: size, height: size }}
            onError={(e) => {
                if (e.currentTarget.src !== avatarFallback) {
                    e.currentTarget.src = avatarFallback;
                }
            }}
        />
    );
}
