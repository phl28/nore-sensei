import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function RedirectToLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/login" });
  }, [navigate]);
  return null;
}

function AppLayout() {
  return (
    <>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f1a]">
          <div className="flex items-center gap-3 text-sm text-[#64748b]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            Loading...
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <RedirectToLogin />
      </Unauthenticated>
      <Authenticated>
        <Layout>
          <Outlet />
        </Layout>
      </Authenticated>
    </>
  );
}
