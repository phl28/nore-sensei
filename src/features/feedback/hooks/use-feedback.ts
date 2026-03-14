import { useState, useCallback, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { AudioMetrics, VideoMetrics, InstantCue, CoachingFeedback } from "../types";
import { evaluateInstantFeedback, resetInstantFeedback } from "../instant-feedback";
import { pushAudioFrame, pushVideoFrame, takeSnapshot, resetBuffer } from "../feature-aggregator";
import type { Id } from "../../../../convex/_generated/dataModel";

interface UseFeedbackReturn {
  instantCue: InstantCue | null;
  coaching: CoachingFeedback | null;
  isGenerating: boolean;
  pushFrame: (audio: AudioMetrics, video: VideoMetrics) => void;
  requestCoaching: (
    sessionId: Id<"practiceSessions">,
    exerciseIndex: number,
    exerciseTitle: string
  ) => Promise<CoachingFeedback>;
  reset: () => void;
}

export function useFeedback(): UseFeedbackReturn {
  const [instantCue, setInstantCue] = useState<InstantCue | null>(null);
  const [coaching, setCoaching] = useState<CoachingFeedback | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const generateFeedback = useAction(api.feedback.generateFeedback);
  const cueTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const pushFrame = useCallback((audio: AudioMetrics, video: VideoMetrics) => {
    pushAudioFrame(audio);
    pushVideoFrame(video);

    const cue = evaluateInstantFeedback(audio, video);
    setInstantCue(cue);

    if (cueTimeoutRef.current) clearTimeout(cueTimeoutRef.current);
    if (cue) {
      cueTimeoutRef.current = setTimeout(() => setInstantCue(null), 3000);
    }
  }, []);

  const requestCoaching = useCallback(
    async (
      sessionId: Id<"practiceSessions">,
      exerciseIndex: number,
      exerciseTitle: string
    ): Promise<CoachingFeedback> => {
      setIsGenerating(true);
      const snapshot = takeSnapshot();

      try {
        const result = await generateFeedback({
          sessionId,
          exerciseIndex,
          exerciseTitle,
          audioMetrics: snapshot.audio,
          videoMetrics: snapshot.video,
        });

        const feedback: CoachingFeedback = {
          feedback: result.feedback,
          overallScore: result.overallScore,
          timestamp: Date.now(),
        };

        setCoaching(feedback);
        return feedback;
      } finally {
        setIsGenerating(false);
      }
    },
    [generateFeedback]
  );

  const reset = useCallback(() => {
    setInstantCue(null);
    setCoaching(null);
    resetInstantFeedback();
    resetBuffer();
  }, []);

  useEffect(() => {
    return () => {
      if (cueTimeoutRef.current) clearTimeout(cueTimeoutRef.current);
    };
  }, []);

  return { instantCue, coaching, isGenerating, pushFrame, requestCoaching, reset };
}
