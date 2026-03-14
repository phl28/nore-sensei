import { useState, useCallback, useRef } from "react";

interface UseCameraReturn {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const start = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
          frameRate: { ideal: 30 },
        },
      });

      setStream(mediaStream);
      setIsActive(true);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera access in your browser settings."
          : "Failed to access camera.";
      setError(msg);
    }
  }, []);

  const stop = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsActive(false);
  }, [stream]);

  return { stream, videoRef, isActive, error, start, stop };
}
