import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button, cn } from "@/components/ui/button";

export const Route = createFileRoute("/_app/lessons/$lessonId")({
  component: LessonDetailPage,
});

function LessonDetailPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const lesson = useQuery(api.lessons.get, {
    lessonId: lessonId as Id<"lessons">,
  });

  if (lesson === undefined) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#0f0f1a]">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded bg-[#1a1a2e]" />
            <div className="h-4 w-96 animate-pulse rounded bg-[#1a1a2e]" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-[#1a1a2e]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (lesson === null) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#0f0f1a]">
        <div className="text-center">
          <p className="text-sm text-[#64748b]">Lesson not found</p>
          <Link
            to="/lessons"
            className="mt-3 inline-block text-sm text-amber-400"
          >
            &larr; Back to lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0f0f1a]">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Breadcrumb */}
        <Link
          to="/lessons"
          className="mb-6 inline-flex items-center gap-1 text-xs text-[#4a4a6a] transition-colors hover:text-[#94a3b8]"
        >
          &larr; All lessons
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e2e8f0]">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#94a3b8]">
            {lesson.description}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              {lesson.technique.replace("-", " ")}
            </span>
            <span className="text-xs text-[#4a4a6a]">
              {lesson.exercises.length} exercise
              {lesson.exercises.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Exercises */}
        <div className="mb-8 space-y-3">
          {lesson.exercises.map((ex: any, i: number) => (
            <div
              key={i}
              className="rounded-xl border border-[#1e1e36] bg-[#1a1a2e]/60 p-5"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a2a4a] font-mono text-xs font-bold text-[#94a3b8]">
                  {i + 1}
                </span>
                <h3 className="text-sm font-semibold text-[#e2e8f0]">
                  {ex.title}
                </h3>
                {ex.targetNote && (
                  <span className="rounded bg-[#2a2a4a] px-2 py-0.5 font-mono text-[10px] text-amber-300/60">
                    {ex.targetNote}
                  </span>
                )}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-[#64748b]">
                {ex.instructions}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#4a4a6a]">
                  {ex.durationSeconds}s
                </span>
                <span className="text-[#1e1e36]">&middot;</span>
                {ex.focusMetrics.map((m: string) => (
                  <span
                    key={m}
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      "bg-[#12121f] text-[#4a4a6a]"
                    )}
                  >
                    {m.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <Button
          onClick={() =>
            navigate({
              to: "/practice",
              search: { lessonId: lesson._id },
            })
          }
          size="lg"
          className="w-full bg-amber-500 text-[#0a0a14] font-semibold hover:bg-amber-400"
        >
          Start Lesson
        </Button>
      </div>
    </div>
  );
}
