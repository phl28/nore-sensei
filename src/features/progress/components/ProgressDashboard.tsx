import type { Id } from "../../../../convex/_generated/dataModel";
import { useProgress } from "@/features/progress/hooks/use-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricChart } from "./MetricChart";

interface ProgressDashboardProps {
  userId: Id<"users">;
}

export function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const { stats, sessions, isLoading } = useProgress(userId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-[#1a1a2e]"
            />
          ))}
        </div>
        <div className="h-52 animate-pulse rounded-xl bg-[#1a1a2e]" />
      </div>
    );
  }

  const chartData =
    stats?.recentSessions
      ?.filter((s: any) => s.endedAt)
      .map((s: any) => ({
        label: new Date(s.startedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: 0,
      })) ?? [];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-[#1e1e36] bg-[#1a1a2e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium tracking-wider text-[#64748b] uppercase">
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-3xl font-bold text-[#e2e8f0]">
              {stats?.totalSessions ?? 0}
            </span>
          </CardContent>
        </Card>

        <Card className="border-[#1e1e36] bg-[#1a1a2e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium tracking-wider text-[#64748b] uppercase">
              Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-3xl font-bold text-[#e2e8f0]">
              {stats?.totalExercises ?? 0}
            </span>
          </CardContent>
        </Card>

        <Card className="border-[#1e1e36] bg-[#1a1a2e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium tracking-wider text-[#64748b] uppercase">
              Avg Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-3xl font-bold text-amber-400">
              {stats?.averageScore ? Math.round(stats.averageScore * 100) : 0}%
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Score chart */}
      <MetricChart data={chartData} title="Recent Session Scores" />

      {/* Recent sessions list */}
      <div className="rounded-xl bg-[#1a1a2e] p-5">
        <h4 className="mb-4 text-sm font-medium text-[#94a3b8]">
          Recent Sessions
        </h4>
        {!sessions || sessions.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#4a4a6a]">
            No practice sessions yet. Start your first lesson!
          </p>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 10).map((s: any) => (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-lg bg-[#12121f] px-4 py-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-[#e2e8f0]">
                    {new Date(s.startedAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-[#4a4a6a]">
                    {new Date(s.startedAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span className="text-xs text-[#64748b]">
                  {s.endedAt
                    ? `${Math.round((s.endedAt - s.startedAt) / 60000)} min`
                    : "In progress"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
