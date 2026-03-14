import { useState, useRef, useCallback, useEffect } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

interface UseFaceMeshReturn {
  landmarks: NormalizedLandmark[] | null;
  isLoading: boolean;
  isDetecting: boolean;
  error: string | null;
  start: (video: HTMLVideoElement) => void;
  stop: () => void;
}

export function useFaceMesh(): UseFaceMeshReturn {
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(-1);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setIsLoading(true);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });
        if (!cancelled) {
          landmarkerRef.current = landmarker;
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(`Failed to load face model: ${err}`);
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const start = useCallback((video: HTMLVideoElement) => {
    if (!landmarkerRef.current) return;
    setIsDetecting(true);

    function detect() {
      if (!landmarkerRef.current || !video.videoWidth) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      const now = performance.now();
      if (now <= lastTimeRef.current) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      lastTimeRef.current = now;

      const result = landmarkerRef.current.detectForVideo(video, now);
      if (result.faceLandmarks.length > 0) {
        setLandmarks(result.faceLandmarks[0]);
      }

      rafRef.current = requestAnimationFrame(detect);
    }

    rafRef.current = requestAnimationFrame(detect);
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsDetecting(false);
    setLandmarks(null);
    lastTimeRef.current = -1;
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return { landmarks, isLoading, isDetecting, error, start, stop };
}
