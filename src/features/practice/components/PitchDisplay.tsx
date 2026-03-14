import { cn } from "@/components/ui/button";

interface PitchDisplayProps {
  pitch: {
    frequency: number;
    clarity: number;
    note: string;
    cents: number;
  } | null;
  targetNote?: string;
}

export function PitchDisplay({ pitch, targetNote }: PitchDisplayProps) {
  const cents = pitch?.cents ?? 0;
  const isOnPitch = pitch && Math.abs(cents) < 10;
  const needlePosition = pitch ? Math.max(-50, Math.min(50, cents)) : 0;
  const needlePct = ((needlePosition + 50) / 100) * 100;

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#1a1a2e] px-5 py-4 shadow-inner">
      {/* Subtle gradient glow when on pitch */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500",
          isOnPitch ? "opacity-100" : undefined
        )}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(250,204,21,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Top row: note name + target */}
      <div className="relative flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "font-mono text-3xl font-bold tracking-tight transition-colors duration-200",
              !pitch ? "text-[#4a4a6a]" : undefined,
              pitch && !isOnPitch ? "text-[#e2e8f0]" : undefined,
              isOnPitch ? "text-amber-400" : undefined
            )}
          >
            {pitch?.note ?? "--"}
          </span>
          {pitch && (
            <span
              className={cn(
                "font-mono text-sm tabular-nums transition-colors duration-200",
                Math.abs(cents) < 10
                  ? "text-amber-400/70"
                  : Math.abs(cents) < 25
                    ? "text-[#94a3b8]"
                    : "text-red-400/80"
              )}
            >
              {cents > 0 ? "+" : ""}
              {Math.round(cents)}c
            </span>
          )}
        </div>
        {targetNote && (
          <span className="rounded-md bg-[#2a2a4a] px-2.5 py-0.5 font-mono text-xs text-amber-300/60">
            Target: {targetNote}
          </span>
        )}
      </div>

      {/* Pitch meter bar */}
      <div className="relative mt-3.5">
        {/* Track bg */}
        <div className="relative h-3 overflow-hidden rounded-full bg-[#12121f]">
          {/* Tick marks */}
          {[-50, -25, 0, 25, 50].map((tick) => (
            <div
              key={tick}
              className={cn(
                "absolute top-0 h-full w-px",
                tick === 0 ? "bg-amber-500/30" : "bg-[#2a2a4a]"
              )}
              style={{ left: `${((tick + 50) / 100) * 100}%` }}
            />
          ))}

          {/* Center "sweet spot" glow zone */}
          <div
            className="absolute top-0 h-full rounded-full bg-amber-500/10"
            style={{ left: "40%", width: "20%" }}
          />

          {/* Needle / indicator */}
          {pitch && (
            <div
              className="absolute top-0 h-full w-1.5 -translate-x-1/2 rounded-full transition-[left] duration-100 ease-out"
              style={{
                left: `${needlePct}%`,
                background: isOnPitch
                  ? "linear-gradient(to bottom, #fbbf24, #f59e0b)"
                  : Math.abs(cents) < 25
                    ? "linear-gradient(to bottom, #94a3b8, #64748b)"
                    : "linear-gradient(to bottom, #f87171, #ef4444)",
                boxShadow: isOnPitch
                  ? "0 0 8px rgba(251,191,36,0.5)"
                  : "none",
              }}
            />
          )}
        </div>

        {/* Labels */}
        <div className="mt-1 flex justify-between font-mono text-[10px] text-[#4a4a6a]">
          <span>flat</span>
          <span>sharp</span>
        </div>
      </div>

      {/* Frequency readout */}
      {pitch && (
        <div className="mt-1 text-right font-mono text-[10px] tabular-nums text-[#4a4a6a]">
          {pitch.frequency.toFixed(1)} Hz
        </div>
      )}
    </div>
  );
}
