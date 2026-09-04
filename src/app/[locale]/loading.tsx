import { RubElHizb } from "@/components/rub-el-hizb";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <RubElHizb className="h-10 w-10 animate-spin text-gold-600" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
}