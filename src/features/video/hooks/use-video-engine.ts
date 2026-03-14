import { useMemo, useCallback, useRef, useEffect } from "react";
import { useCamera } from "./use-camera";
import { usePoseDetection } from "./use-pose-detection";
import { useFaceMesh } from "./use-face-mesh";
import { calculatePoseMetrics } from "../utils/pose-metrics";
import { calculateFaceMetrics } from "../utils/face-metrics";
import type { VideoMetrics } from "@/features/feedback/types";

export function useVideoEngine() {
  const camera = useCamera();
  const pose = usePoseDetection();
  const face = useFaceMesh();
  const startedRef = useRef(false);

  useEffect(() => {
    if (camera.isActive && camera.videoRef.current && !startedRef.current) {
      const video = camera.videoRef.current;
      const onPlaying = () => {
        pose.start(video);
        face.start(video);
        startedRef.current = true;
      };

      if (video.readyState >= 2) {
        onPlaying();
      } else {
        video.addEventListener("loadeddata", onPlaying, { once: true });
        return () => video.removeEventListener("loadeddata", onPlaying);
      }
    }
  }, [camera.isActive, camera.videoRef, pose, face]);

  const metrics = useMemo((): VideoMetrics => {
    const poseMetrics = pose.landmarks
      ? calculatePoseMetrics(pose.landmarks)
      : { shoulderElevation: 0, spineAlignment: 0, ribcageExpansion: 0 };

    const faceMetrics = face.landmarks
      ? calculateFaceMetrics(face.landmarks)
      : { jawOpenAngle: 0 };

    return { ...poseMetrics, ...faceMetrics };
  }, [pose.landmarks, face.landmarks]);

  const isLoading = pose.isLoading || face.isLoading;
  const modelError = pose.error || face.error;

  const start = useCallback(async () => {
    await camera.start();
  }, [camera]);

  const stop = useCallback(() => {
    pose.stop();
    face.stop();
    camera.stop();
    startedRef.current = false;
  }, [pose, face, camera]);

  return {
    camera,
    pose,
    face,
    metrics,
    isLoading,
    modelError,
    start,
    stop,
  };
}
