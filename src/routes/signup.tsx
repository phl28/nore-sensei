import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message ?? "Sign up failed");
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a14] px-4">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse, #fbbf24 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-lg font-bold text-[#e2e8f0]">
            Nore Sensei
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-[#1e1e36] bg-[#1a1a2e] p-7">
          <h1 className="mb-1 text-xl font-semibold text-[#e2e8f0]">
            Create your account
          </h1>
          <p className="mb-6 text-sm text-[#64748b]">
            Start your vocal technique journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#94a3b8]">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#2a2a4a] bg-[#12121f] px-3 text-sm text-[#e2e8f0] placeholder-[#4a4a6a] outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#94a3b8]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#2a2a4a] bg-[#12121f] px-3 text-sm text-[#e2e8f0] placeholder-[#4a4a6a] outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#94a3b8]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#2a2a4a] bg-[#12121f] px-3 text-sm text-[#e2e8f0] placeholder-[#4a4a6a] outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                placeholder="Choose a password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-amber-500 font-semibold text-[#0a0a14] hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-[#4a4a6a]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-400/80 transition-colors hover:text-amber-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
