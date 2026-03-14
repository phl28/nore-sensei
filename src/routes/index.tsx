import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a14]">
      {/* Atmospheric background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(ellipse, #fbbf24 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(ellipse, #6366f1 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-bold tracking-tight text-[#e2e8f0]">
          Nore Sensei
        </span>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a1a2e]"
            >
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              size="sm"
              className="bg-amber-500 text-[#0a0a14] font-semibold hover:bg-amber-400"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          {/* Decorative sound wave */}
          <div className="mb-8 flex items-center justify-center gap-[3px]">
            {[0.3, 0.5, 0.7, 1, 0.8, 1, 0.7, 0.5, 0.8, 1, 0.6, 0.4, 0.3].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-amber-400"
                  style={{
                    height: `${h * 28}px`,
                    opacity: 0.3 + h * 0.5,
                    animation: `pulse 2s ease-in-out ${i * 0.12}s infinite alternate`,
                  }}
                />
              )
            )}
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-[#e2e8f0] sm:text-6xl">
            Your body is
            <br />
            <span className="text-amber-400">your instrument</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-[#64748b]">
            Nore Sensei watches your posture, breathing, and jaw — not just
            your pitch — to teach you how to sing with power and ease.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-amber-500 text-[#0a0a14] font-semibold hover:bg-amber-400 px-8"
              >
                Start Learning Free
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-[#4a4a6a]">
            Browser-based. No downloads. All processing stays on your device.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 7h.01M17 7h.01" />
                </svg>
              ),
              title: "See Your Technique",
              desc: "Camera AI tracks your posture, shoulder tension, jaw opening, and breathing patterns in real time.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" />
                </svg>
              ),
              title: "Hear Your Voice",
              desc: "Pitch detection, breath support analysis, and tone quality measurement — far beyond a simple tuner.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
                  <path d="M8 9h8M8 13h4" />
                </svg>
              ),
              title: "Get AI Coaching",
              desc: "After each exercise, AI synthesizes what it saw and heard into simple, actionable coaching feedback.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-[#1e1e36] bg-[#1a1a2e]/60 p-6 backdrop-blur-sm transition-colors hover:border-amber-500/20 hover:bg-[#1a1a2e]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/15">
                {f.icon}
              </div>
              <h3 className="mb-2 text-sm font-semibold text-[#e2e8f0]">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#64748b]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <h2 className="mb-10 text-center text-xs font-medium tracking-[0.2em] text-[#4a4a6a] uppercase">
          How it works
        </h2>
        <div className="flex flex-col items-center gap-0 sm:flex-row sm:gap-0">
          {[
            { step: "01", label: "Allow camera & mic", sub: "All processing stays local" },
            { step: "02", label: "Follow a guided lesson", sub: "Posture, breathing, then singing" },
            { step: "03", label: "Get technique feedback", sub: "AI coaches what to fix next" },
          ].map((s, i) => (
            <div key={s.step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center text-center px-6 py-4">
                <span className="font-mono text-2xl font-bold text-amber-400/40">
                  {s.step}
                </span>
                <span className="mt-2 text-sm font-medium text-[#e2e8f0]">
                  {s.label}
                </span>
                <span className="mt-1 text-xs text-[#4a4a6a]">{s.sub}</span>
              </div>
              {i < 2 && (
                <div className="hidden h-px w-12 bg-[#1e1e36] sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1e1e36] py-6 text-center text-xs text-[#4a4a6a]">
        Nore Sensei — AI Singing Teacher
      </footer>

      {/* Keyframe for sound wave animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.5); }
        }
      `}</style>
    </div>
  );
}
