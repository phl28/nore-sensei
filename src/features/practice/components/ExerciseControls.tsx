import { useState, useEffect } from "react";
import { cn } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

interface ExerciseControlsProps {
  exercise: {
    title: string;
    instructions: string;
    targetNote?: string;
    durationSeconds: number;
  } | null;
  phase: "instructions" | "countdown" | "active" | "feedback";
  timeRemaining: number;
  onStart: () => void;
  onStop: () => void;
}

function CountdownNumber() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => (c > 1 ? c - 1 : c));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <span
          key={count}
          className="block font-mono text-8xl font-bold text-amber-400 animate-[pulse_0.5s_ease-out]"
          style={{ textShadow: "0 0 40px rgba(250,204,21,0.3)" }}
        >
          {count}
        </span>
      </div>
      <span className="text-sm text-[#64748b]">Get ready...</span>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExerciseControls({
  exercise,
  phase,
  timeRemaining,
  onStart,
  onStop,
}: ExerciseControlsProps) {
  if (!exercise) {
    return (
      <div className="flex h-full items-center justify-center text-[#4a4a6a]">
        No exercise loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Exercise title */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[#e2e8f0]">
          {exercise.title}
        </h3>
        {exercise.targetNote && (
          <span className="mt-1 inline-block rounded-md bg-amber-400/10 px-2 py-0.5 font-mono text-xs text-amber-300">
            {exercise.targetNote}
          </span>
        )}
      </div>

      {/* Phase content */}
      {phase === "instructions" && (
        <div className="flex flex-col items-center gap-4">
          <p className="max-w-sm text-center text-sm leading-relaxed text-[#94a3b8]">
            {exercise.instructions}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#4a4a6a]">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4v4l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {exercise.durationSeconds}s
          </div>
          <Button
            onClick={onStart}
            className="mt-1 bg-amber-500 px-8 text-[#1a1a2e] hover:bg-amber-400 font-semibold"
          >
            Start Exercise
          </Button>
        </div>
      )}

      {phase === "countdown" && <CountdownNumber />}

      {phase === "active" && (
        <div className="flex flex-col items-center gap-4">
          {/* Timer ring */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="#2a2a4a"
                strokeWidth="4"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={
                  2 *
                  Math.PI *
                  42 *
                  (1 - timeRemaining / exercise.durationSeconds)
                }
                className="transition-[stroke-dashoffset] duration-1000 ease-linear"
              />
            </svg>
            <span className="font-mono text-2xl font-bold tabular-nums text-[#e2e8f0]">
              {formatTime(timeRemaining)}
            </span>
          </div>

          <p className="max-w-xs text-center text-xs text-[#64748b]">
            {exercise.instructions}
          </p>

          <Button
            onClick={onStop}
            variant="outline"
            size="sm"
            className={cn(
              "border-[#2a2a4a] bg-transparent text-[#94a3b8] hover:bg-[#2a2a4a] hover:text-[#e2e8f0]"
            )}
          >
            Stop
          </Button>
        </div>
      )}

      {phase === "feedback" && (
        <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          Reviewing your performance...
        </div>
      )}
    </div>
  );
}
