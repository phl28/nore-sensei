import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/components/ui/button";

export const Route = createFileRoute("/_app/lessons/")({
  component: LessonCatalogPage,
});

const TECHNIQUE_COLORS: Record<string, string> = {
  "breath-support": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "tone-production": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "pitch-control": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((d) => (
        <div
          key={d}
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            d <= level ? "bg-amber-400" : "bg-[#2a2a4a]"
          )}
        />
      ))}
    </div>
  );
}

function LessonCatalogPage() {
  const lessons = useQuery(api.lessons.list);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0f0f1a]">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Lessons</h1>
          <p className="mt-1 text-sm text-[#64748b]">
            Beginner lessons focused on building solid vocal technique
            foundations.
          </p>
        </div>

        {!lessons ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-xl bg-[#1a1a2e]"
              />
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#4a4a6a]">
            No lessons available yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson: any) => {
              const techniqueClass =
                TECHNIQUE_COLORS[lesson.technique] ??
                "bg-[#2a2a4a]/50 text-[#94a3b8] border-[#2a2a4a]";

              return (
                <Link
                  key={lesson._id}
                  to="/lessons/$lessonId"
                  params={{ lessonId: lesson._id }}
                  className="group flex flex-col rounded-xl border border-[#1e1e36] bg-[#1a1a2e]/60 p-5 transition-colors hover:border-amber-500/20 hover:bg-[#1a1a2e]"
                >
                  {/* Top row: technique badge + difficulty */}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={cn(
                        "rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        techniqueClass
                      )}
                    >
                      {lesson.technique.replace("-", " ")}
                    </span>
                    <DifficultyDots level={lesson.difficulty} />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-base font-semibold text-[#e2e8f0] transition-colors group-hover:text-amber-400">
                    {lesson.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-[#64748b]">
                    {lesson.description.length > 120
                      ? lesson.description.slice(0, 120) + "..."
                      : lesson.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-[#1e1e36] pt-3">
                    <span className="text-xs text-[#4a4a6a]">
                      {lesson.exercises.length} exercise
                      {lesson.exercises.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs font-medium text-amber-400/60 transition-colors group-hover:text-amber-400">
                      Start &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
