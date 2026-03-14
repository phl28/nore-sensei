import { useEffect, useRef, useCallback } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { Lesson } from "@/lib/lessons/types";
import type { InstantCue } from "@/features/feedback/types";
import { useVideoEngine } from "@/features/video/hooks/use-video-engine";
import { useAudioEngine } from "@/features/audio/hooks/use-audio-engine";
import { usePracticeSession } from "@/features/practice/hooks/use-practice-session";
import { PitchDisplay } from "./PitchDisplay";
import { PostureOverlay } from "./PostureOverlay";
import { FaceOverlay } from "./FaceOverlay";
import { CoachingPanel } from "./CoachingPanel";
import { ExerciseControls } from "./ExerciseControls";
import { Meter } from "@/components/ui/meter";
import { cn } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

interface PracticeViewProps {
  lesson: Lesson | null;
  userId: Id<"users">;
}

export function PracticeView({ lesson, userId }: PracticeViewProps) {
  const video = useVideoEngine();
  const audio = useAudioEngine();
  const session = usePracticeSession();
  const frameRef = useRef<number>(0);

  const currentExercise = lesson?.exercises[session.currentExerciseIndex] ?? null;

  // Push frames during active phase
  const tick = useCallback(() => {
    if (session.phase === "active") {
      session.pushFrame(audio.metrics, video.metrics);
    }
    frameRef.current = requestAnimationFrame(tick);
  }, [session, audio.metrics, video.metrics]);

  useEffect(() => {
    if (session.phase === "active") {
      frameRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [session.phase, tick]);

  const handleStart = useCallback(async () => {
    if (!lesson) return;
    await video.start();
    await audio.start();
    if (!session.sessionId) {
      await session.startSession(userId, lesson);
    }
    session.startExercise();
  }, [lesson, video, audio, session, userId]);

  const handleStop = useCallback(async () => {
    audio.stop();
    video.stop();
    await session.endSession();
  }, [audio, video, session]);

  const cue: InstantCue | null = session.feedback.instantCue;

  const cueColor = cue
    ? {
        correction: "border-red-500/30 bg-red-500/10 text-red-300",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        info: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      }[cue.severity]
    : "";

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-[#0f0f1a]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#1e1e36] px-5 py-2.5">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-[#e2e8f0]">
            {lesson?.title ?? "Free Practice"}
          </h2>
          {lesson && (
            <span className="rounded bg-[#1a1a2e] px-2 py-0.5 font-mono text-xs text-[#64748b]">
              {session.currentExerciseIndex + 1}/{lesson.exercises.length}
            </span>
          )}
        </div>
        {video.isLoading && (
          <span className="flex items-center gap-2 text-xs text-[#4a4a6a]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            Loading ML models...
          </span>
        )}
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Camera feed with overlays */}
        <div className="relative flex w-[45%] items-center justify-center bg-black p-3">
          <div className="relative overflow-hidden rounded-lg">
            <video
              ref={video.camera.videoRef}
              autoPlay
              playsInline
              muted
              className="block max-h-full w-full -scale-x-100 object-cover"
              style={{ maxWidth: 640, maxHeight: 480 }}
            />
            {video.pose.landmarks && (
              <PostureOverlay
                landmarks={video.pose.landmarks}
                metrics={{
                  shoulderElevation: video.metrics.shoulderElevation,
                  spineAlignment: video.metrics.spineAlignment,
                  ribcageExpansion: video.metrics.ribcageExpansion,
                }}
                width={640}
                height={480}
              />
            )}
            {video.face.landmarks && (
              <FaceOverlay
                landmarks={video.face.landmarks}
                metrics={{ jawOpenAngle: video.metrics.jawOpenAngle }}
                width={640}
                height={480}
              />
            )}
          </div>

          {/* Camera error overlay */}
          {video.camera.error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="max-w-xs text-center text-sm text-red-400">
                {video.camera.error}
              </p>
            </div>
          )}
        </div>

        {/* Center — Exercise controls + coaching */}
        <div className="flex w-[30%] flex-col border-x border-[#1e1e36]">
          <div className="flex flex-1 flex-col items-center justify-center p-5">
            <ExerciseControls
              exercise={currentExercise}
              phase={session.phase}
              timeRemaining={session.timeRemaining}
              onStart={handleStart}
              onStop={handleStop}
            />
          </div>

          {/* Pitch display */}
          <div className="border-t border-[#1e1e36] p-3">
            <PitchDisplay
              pitch={audio.pitch.pitch}
              targetNote={currentExercise?.targetNote}
            />
          </div>

          {/* Coaching panel */}
          <div className="border-t border-[#1e1e36] p-3">
            <CoachingPanel
              feedback={session.feedback.coaching}
              isGenerating={session.feedback.isGenerating}
            />
          </div>
        </div>

        {/* Right — Live meters + instant cue */}
        <div className="flex w-[25%] flex-col gap-4 p-5">
          <h4 className="text-xs font-medium tracking-wider text-[#4a4a6a] uppercase">
            Live Metrics
          </h4>

          {/* Instant cue */}
          {cue && (
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-300",
                cueColor
              )}
            >
              {cue.message}
            </div>
          )}

          {/* Technique meters */}
          <div className="space-y-3">
            <Meter
              label="Posture"
              value={video.metrics.spineAlignment}
              color={video.metrics.spineAlignment > 0.6 ? "green" : "red"}
            />
            <Meter
              label="Shoulders"
              value={1 - video.metrics.shoulderElevation}
              color={video.metrics.shoulderElevation < 0.6 ? "green" : "red"}
            />
            <Meter
              label="Jaw Opening"
              value={video.metrics.jawOpenAngle}
              color={video.metrics.jawOpenAngle > 0.45 ? "green" : "yellow"}
            />
            <Meter
              label="Breath Support"
              value={video.metrics.ribcageExpansion}
              color={video.metrics.ribcageExpansion > 0.4 ? "green" : "yellow"}
            />
          </div>

          <div className="my-1 h-px bg-[#1e1e36]" />

          <h4 className="text-xs font-medium tracking-wider text-[#4a4a6a] uppercase">
            Vocal
          </h4>
          <div className="space-y-3">
            <Meter
              label="Pitch Accuracy"
              value={audio.metrics.pitchAccuracy}
              color={audio.metrics.pitchAccuracy > 0.7 ? "green" : "yellow"}
            />
            <Meter
              label="Stability"
              value={audio.metrics.pitchStability}
              color={audio.metrics.pitchStability > 0.6 ? "green" : "yellow"}
            />
            <Meter
              label="Breath Support"
              value={audio.metrics.breathiness}
              color={audio.metrics.breathiness > 0.5 ? "green" : "red"}
            />
          </div>

          <div className="mt-auto">
            <Button
              onClick={handleStop}
              variant="outline"
              size="sm"
              className="w-full border-[#2a2a4a] bg-transparent text-[#64748b] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
            >
              End Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
