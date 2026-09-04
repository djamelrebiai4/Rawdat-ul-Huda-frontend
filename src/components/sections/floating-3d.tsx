import Image from "next/image";
import { cn } from "@/lib/utils";

export function Floating3D({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative flex items-center justify-center", className)}
    >
      <div className="animate-glow absolute h-48 w-[85%] rounded-full bg-terracotta-500/30 blur-3xl sm:h-64" />

      <div className="animate-float relative w-[min(85vw,440px)] lg:w-full lg:max-w-[540px]">
        <Image
          src="/3d.png"
          alt=""
          width={1408}
          height={768}
          priority
          className="h-auto w-full [transform:perspective(800px)_rotateX(4deg)] sm:[transform:perspective(1100px)_rotateX(8deg)] drop-shadow-[0_30px_50px_rgba(0,0,0,0.45)]"
        />
      </div>
    </div>
  );
}