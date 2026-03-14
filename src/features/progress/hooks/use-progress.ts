import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useProgress(userId: Id<"users"> | undefined) {
  const stats = useQuery(
    api.progress.getUserStats,
    userId ? { userId } : "skip"
  );

  const sessions = useQuery(
    api.progress.getUserSessions,
    userId ? { userId } : "skip"
  );

  return {
    stats,
    sessions,
    isLoading: stats === undefined || sessions === undefined,
  };
}
