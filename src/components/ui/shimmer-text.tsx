"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Variant =
  | "default"
  | "secondary"
  | "destructive"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "orange"
  | "cyan"
  | "indigo"
  | "violet"
  | "rose"
  | "amber"
  | "lime"
  | "emerald"
  | "sky"
  | "slate"
  | "fuchsia";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
  lineWidth?: number;
  angle?: number;
}

const variantMap: Record<Variant, string> = {
  default: "",
  secondary: "text-secondary-foreground",
  destructive: "text-destructive dark:text-destructive-foreground",
  red: "text-red-600 dark:text-red-400",
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  purple: "text-purple-600 dark:text-purple-400",
  pink: "text-pink-600 dark:text-pink-400",
  orange: "text-orange-600 dark:text-orange-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
  violet: "text-violet-600 dark:text-violet-400",
  rose: "text-rose-600 dark:text-rose-400",
  amber: "text-amber-600 dark:text-amber-400",
  lime: "text-lime-600 dark:text-lime-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  slate: "text-slate-600 dark:text-slate-400",
  fuchsia: "text-fuchsia-600 dark:text-fuchsia-400",
};

export function ShimmerText({
  children,
  className,
  variant = "default",
  duration = 5,
  delay = 0.5,
  repeatDelay = 0.3,
  lineWidth = 1.5,
  angle = 60,
}: ShimmerTextProps) {
  const halfWidth = lineWidth / 2;
  const center = 50;
  const start = center - halfWidth;
  const end = center + halfWidth;

  const bgSize = 200;

  const gradient = `linear-gradient(${angle}deg, 
    currentColor 0%, 
    currentColor ${start}%, 
    var(--shimmer-contrast) ${center}%, 
    currentColor ${end}%, 
    currentColor 100%)`;

  return (
    <div className="group overflow-hidden">
      <div>
        <motion.div
          className={cn(
            "inline-block [--shimmer-contrast:rgba(255,255,255,0.9)] dark:[--shimmer-contrast:rgba(0,0,0,0.7)]",
            variantMap[variant],
            className,
          )}
          style={{
            WebkitTextFillColor: "transparent",
            background: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            backgroundRepeat: "repeat",
            backgroundSize: `${bgSize}% ${bgSize}%`,
          } as React.CSSProperties}
          initial={{
            backgroundPositionX: "-50%",
            backgroundPositionY: "0%",
          }}
          animate={{
            backgroundPositionX: ["-50%", "150%"],
            backgroundPositionY: ["0%", "0%"],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatDelay,
            ease: "linear",
          }}
        >
          <span>{children}</span>
        </motion.div>
      </div>
    </div>
  );
}

export default ShimmerText;