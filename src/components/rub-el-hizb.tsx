import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

type RubElHizbProps = {
  className?: string;
  strokeWidth?: number;
};

export function RubElHizb({ className, strokeWidth = 1.5 }: RubElHizbProps) {
  const locale = useLocale();
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-6", locale === "ar" && "rtl:scale-x-[-1]", className)}
    >
      <g stroke="currentColor" strokeWidth={strokeWidth}>
        <rect x="15" y="15" width="34" height="34" transform="rotate(45 32 32)" />
        <rect x="20" y="20" width="24" height="24" />
        <circle cx="32" cy="32" r="4.5" fill="currentColor" stroke="none" />
        <path d="M32 6v10M32 48v10M6 32h10M48 32h10" />
        <path d="M12 12l7 7M52 12l-7 7M12 52l7-7M52 52l-7-7" strokeLinecap="round" />
      </g>
    </svg>
  );
}