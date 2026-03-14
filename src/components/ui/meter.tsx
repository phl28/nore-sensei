import { cn } from "./button";

interface MeterProps {
  label: string;
  value: number;
  max?: number;
  color?: "green" | "yellow" | "red" | "blue";
  className?: string;
}

export function Meter({ label, value, max = 1, color = "blue", className }: MeterProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const barColor = {
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-primary",
  }[color];

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all duration-300", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
