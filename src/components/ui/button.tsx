import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "accent-alt" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

const variants: Record<string, string> = {
  primary:
    "bg-sage-600 text-cream-50 hover:bg-sage-700 focus-visible:ring-sage-500",
  accent:
    "bg-terracotta-500 text-cream-50 hover:bg-terracotta-600 focus-visible:ring-terracotta-500",
  "accent-alt":
    "bg-ochre-500 text-brown-900 hover:bg-ochre-600 focus-visible:ring-ochre-500",
  outline:
    "border border-sage-600 text-sage-700 hover:bg-sage-50 focus-visible:ring-sage-500",
  ghost:
    "text-sage-700 hover:bg-sage-100/60 focus-visible:ring-sage-500",
  white:
    "bg-cream-50 text-brown-900 hover:bg-cream-200 focus-visible:ring-cream-50",
};

const sizes: Record<string, string> = {
  sm: "h-10 px-4 text-sm min-h-[44px]",
  md: "h-11 px-6 text-sm min-h-[44px]",
  lg: "h-12 px-8 text-base min-h-[44px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";