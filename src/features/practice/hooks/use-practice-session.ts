import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { Lesson, ExercisePhase } from "@/lib/lessons/types";
import type { AudioMetrics, VideoMetrics } from "@/features/feedback/types";
import { useFeedback } from "@/features/feedback/hooks/use-feedback";

interface UsePracticeSessionReturn {
  sessionId: Id<"practiceSessions"> | null;
  currentExerciseIndex: number;
  phase: ExercisePhase;
  timeRemaining: number;
  feedback: ReturnType<typeof useFeedback>;
  startSession: (userId: Id<"users">, lesson: Lesson) => Promise<void>;
  startExercise: () => void;
  endSession: () => Promise<void>;
  pushFrame: (audio: AudioMetrics, video: VideoMetrics) => void;
}

export function usePracticeSession(): UsePracticeSessionReturn {
  const [sessionId, setSessionId] = useState<Id<"practiceSessions"> | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<ExercisePhase>("instructions");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const startMutation = useMutation(api.sessions.start);
  const endMutation = useMutation(api.sessions.end);
  const feedback = useFeedback();

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startSession = useCallback(
    async (userId: Id<"users">, lesson: Lesson) => {
      const id = await startMutation({ userId, lessonId: lesson._id });
      setSessionId(id);
      setCurrentLesson(lesson);
      setCurrentExerciseIndex(0);
      setPhase("instructions");
      feedback.reset();
    },
    [startMutation, feedback]
  );

  const startExercise = useCallback(() => {
    if (!currentLesson) return;

    setPhase("countdown");

    countdownRef.current = setTimeout(() => {
      const exercise = currentLesson.exercises[currentExerciseIndex];
      setPhase("active");
      setTimeRemaining(exercise.durationSeconds);

      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);

            if (sessionId) {
              const ex = currentLesson.exercises[currentExerciseIndex];
              feedback
                .requestCoaching(sessionId, currentExerciseIndex, ex.title)
                .then(() => {
                  setPhase("feedback");
                  setTimeout(() => {
                    if (currentExerciseIndex < currentLesson.exercises.length - 1) {
                      setCurrentExerciseIndex((i) => i + 1);
                      setPhase("instructions");
                      feedback.reset();
                    }
                  }, 5000);
                });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 3000);
  }, [currentLesson, currentExerciseIndex, sessionId, feedback]);

  const endSession = useCallback(async () => {
    if (sessionId) {
      await endMutation({ sessionId });
    }
    clearInterval(timerRef.current);
    clearTimeout(countdownRef.current);
    setSessionId(null);
    setCurrentLesson(null);
    setCurrentExerciseIndex(0);
    setPhase("instructions");
    feedback.reset();
  }, [sessionId, endMutation, feedback]);

  const pushFrame = useCallback(
    (audio: AudioMetrics, video: VideoMetrics) => {
      if (phase === "active") {
        feedback.pushFrame(audio, video);
      }
    },
    [phase, feedback]
  );

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(countdownRef.current);
    };
  }, []);

  return {
    sessionId,
    currentExerciseIndex,
    phase,
    timeRemaining,
    feedback,
    startSession,
    startExercise,
    endSession,
    pushFrame,
  };
}
