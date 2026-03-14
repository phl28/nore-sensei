import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ProgressDashboard } from "@/features/progress/components/ProgressDashboard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const user = useQuery(api.auth.getAuthUser);
  // Better Auth stores users in component "user" table; cast to app "users" table ID for MVP
  const userId = user?._id as any;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0f0f1a]">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Welcome + quick actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#e2e8f0]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[#64748b]">
              Pick up where you left off, or try something new.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/lessons">
              <Button className="bg-amber-500 font-semibold text-[#0a0a14] hover:bg-amber-400">
                Start Lesson
              </Button>
            </Link>
            <Link to="/practice">
              <Button
                variant="outline"
                className="border-[#2a2a4a] bg-transparent text-[#94a3b8] hover:bg-[#1a1a2e] hover:text-[#e2e8f0]"
              >
                Free Practice
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress dashboard */}
        {userId && <ProgressDashboard userId={userId} />}
      </div>
    </div>
  );
}
