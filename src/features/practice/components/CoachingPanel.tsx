import { cn } from "@/components/ui/button";

interface CoachingPanelProps {
  feedback: {
    feedback: string;
    overallScore: number;
    timestamp: number;
  } | null;
  isGenerating: boolean;
}

function scoreColor(score: number): string {
  if (score >= 0.8) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  if (score >= 0.6) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  return "text-red-400 bg-red-400/10 border-red-400/20";
}

function scoreLabel(score: number): string {
  if (score >= 0.8) return "Excellent";
  if (score >= 0.6) return "Good";
  if (score >= 0.4) return "Developing";
  return "Keep Trying";
}

export function CoachingPanel({ feedback, isGenerating }: CoachingPanelProps) {
  if (!feedback && !isGenerating) return null;

  return (
    <div className="relative rounded-xl bg-[#1a1a2e] p-5 shadow-lg">
      {/* Warm subtle border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(250,204,21,0.08)",
        }}
      />

      {isGenerating ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-sm text-[#94a3b8]">Analyzing your technique...</span>
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-4/5 animate-pulse rounded bg-[#2a2a4a]" />
            <div className="h-3.5 w-3/5 animate-pulse rounded bg-[#2a2a4a]" />
          </div>
        </div>
      ) : feedback ? (
        <>
          {/* Score badge */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider text-[#64748b] uppercase">
              Coach Feedback
            </span>
            <span
              className={cn(
                "rounded-md border px-2.5 py-0.5 text-xs font-semibold tabular-nums",
                scoreColor(feedback.overallScore)
              )}
            >
              {Math.round(feedback.overallScore * 100)}% — {scoreLabel(feedback.overallScore)}
            </span>
          </div>

          {/* Speech bubble */}
          <div className="relative rounded-lg bg-[#12121f] px-4 py-3">
            <div
              className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 bg-[#12121f]"
            />
            <p className="relative text-sm leading-relaxed text-[#cbd5e1]">
              {feedback.feedback}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
