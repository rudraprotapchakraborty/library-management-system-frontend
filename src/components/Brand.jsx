import { Link } from "react-router-dom";

/** A serving cloche on a navy tile. */
export function LogoMark({ size = 34, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="13" fill="#16231f" />
      <rect x="11" y="10" width="6.5" height="28" rx="1.6" fill="#6fd0b0" />
      <rect x="20" y="10" width="6.5" height="28" rx="1.6" fill="#9ae3ca" />
      <rect x="29.5" y="12" width="6.5" height="26" rx="1.6" fill="#6fd0b0" transform="rotate(12 32.7 25)" />
      <rect x="9" y="38" width="30" height="2.6" rx="1.3" fill="#6fd0b0" />
    </svg>
  );
}

export default function Brand({ className = "" }) {
  return (
    <Link to="/" aria-label="Shelfwise home" className={`inline-flex w-fit items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="whitespace-nowrap text-[20px] font-bold leading-none tracking-[-0.045em] text-ink sm:text-[22px]">
        Shelf<span className="accent text-[26px]">wise</span>
      </span>
    </Link>
  );
}
