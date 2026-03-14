import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { PracticeView } from "@/features/practice/components/PracticeView";

interface PracticeSearch {
  lessonId?: string;
}

export const Route = createFileRoute("/_app/practice")({
  validateSearch: (search: Record<string, unknown>): PracticeSearch => ({
    lessonId: typeof search.lessonId === "string" ? search.lessonId : undefined,
  }),
  component: PracticePage,
});

function PracticePage() {
  const { lessonId } = Route.useSearch();
  const user = useQuery(api.auth.getAuthUser);

  const lesson = useQuery(
    api.lessons.get,
    lessonId ? { lessonId: lessonId as Id<"lessons"> } : "skip"
  );

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-[#0f0f1a]">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  return <PracticeView lesson={lesson ?? null} userId={user._id as any} />;
}
