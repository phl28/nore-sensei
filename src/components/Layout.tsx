import type { ReactNode } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { cn } from "./ui/button";
import { authClient } from "@/lib/auth-client";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = router.state.location.pathname;

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/lessons", label: "Lessons" },
    { to: "/practice", label: "Practice" },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/dashboard" className="text-lg font-bold text-foreground">
            Nore Sensei
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  pathname.startsWith(item.to)
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={async () => {
                await authClient.signOut();
                navigate({ to: "/login" });
              }}
              className="ml-3 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
