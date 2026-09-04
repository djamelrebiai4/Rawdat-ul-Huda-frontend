import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link
      href="/"
      prefetch
      className="flex flex-col items-center gap-2 md:gap-3 relative z-10"
      aria-label="Rawdat ul-Huda Quran Academy — Home"
    >
      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center overflow-hidden">
        {/* Mobile: simple semi-transparent background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl" />
        {/* Desktop: full glassmorphism with brand accent border */}
        <div className="hidden md:absolute md:inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-xl" />
        <div className="hidden md:absolute md:inset-0 border-[1.5px] rounded-xl bg-gradient-to-r from-terracotta-400/60 via-ochre-400/40 to-terracotta-400/60 opacity-70" />
        <div className="hidden md:absolute md:inset-1 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
        
        <Image
          src="/logo.png"
          alt="Rawdat ul-Huda Quran Academy"
          width={1254}
          height={1254}
          priority
          className="relative z-10 w-6 h-6 md:w-7 md:h-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        />
      </div>
      <div className="w-24 md:w-32 h-[2px] logo-line-glow" />
    </Link>
  );
}