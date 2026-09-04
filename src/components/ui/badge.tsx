import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "terracotta" | "sage" | "ochre" | "outline";
};

const variants: Record<string, string> = {
  terracotta: "bg-terracotta-100 text-terracotta-700 border-terracotta-300",
  sage: "bg-sage-100 text-sage-800 border-sage-300",
  ochre: "bg-ochre-100 text-ochre-700 border-ochre-300",
  outline: "border border-current",
};

export function Badge({ className, variant = "terracotta", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}