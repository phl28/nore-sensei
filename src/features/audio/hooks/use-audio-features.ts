import { useState, useEffect, useRef, useCallback } from "react";
import Meyda from "meyda";

interface AudioFeatures {
  rms: number;
  spectralCentroid: number;
  spectralFlatness: number;
  zcr: number;
}

interface UseAudioFeaturesReturn {
  features: AudioFeatures | null;
  isExtracting: boolean;
  start: () => void;
  stop: () => void;
}

export function useAudioFeatures(
  audioContext: AudioContext | null,
  sourceNode: MediaStreamAudioSourceNode | AnalyserNode | null
): UseAudioFeaturesReturn {
  const [features, setFeatures] = useState<AudioFeatures | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analyzerRef = useRef<any>(null);

  const start = useCallback(() => {
    if (!audioContext || !sourceNode) return;

    try {
      analyzerRef.current = Meyda.createMeydaAnalyzer({
        audioContext,
        source: sourceNode as unknown as AudioNode,
        bufferSize: 2048,
        featureExtractors: [
          "rms",
          "spectralCentroid",
          "spectralFlatness",
          "zcr",
        ],
        callback: (extracted: Record<string, number>) => {
          setFeatures({
            rms: extracted.rms ?? 0,
            spectralCentroid: extracted.spectralCentroid ?? 0,
            spectralFlatness: extracted.spectralFlatness ?? 0,
            zcr: extracted.zcr ?? 0,
          });
        },
      });
      analyzerRef.current.start();
      setIsExtracting(true);
    } catch {
      setIsExtracting(false);
    }
  }, [audioContext, sourceNode]);

  const stop = useCallback(() => {
    analyzerRef.current?.stop();
    analyzerRef.current = null;
    setIsExtracting(false);
    setFeatures(null);
  }, []);

  useEffect(() => {
    return () => {
      analyzerRef.current?.stop();
    };
  }, []);

  return { features, isExtracting, start, stop };
}
