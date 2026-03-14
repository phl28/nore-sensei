import { useMemo } from "react";
import { useMicrophone } from "./use-microphone";
import { usePitchDetection } from "./use-pitch-detection";
import type { AudioMetrics } from "@/features/feedback/types";

export function useAudioEngine() {
  const mic = useMicrophone();
  const pitch = usePitchDetection(mic.analyserNode, mic.audioContext);

  const metrics = useMemo((): AudioMetrics => {
    if (!pitch.pitch) {
      return { pitchAccuracy: 0, pitchStability: 0, rmsStability: 0, breathiness: 0 };
    }

    const centsOff = Math.abs(pitch.pitch.cents);
    const pitchAccuracy = Math.max(0, 1 - centsOff / 50);
    const pitchStability = pitch.pitch.clarity;
    const rmsStability = 0.7;
    const breathiness = Math.min(1, pitch.pitch.clarity * 1.2);

    return { pitchAccuracy, pitchStability, rmsStability, breathiness };
  }, [pitch.pitch]);

  return {
    mic,
    pitch,
    metrics,
    start: async () => {
      await mic.start();
      pitch.start();
    },
    stop: () => {
      pitch.stop();
      mic.stop();
    },
  };
}
