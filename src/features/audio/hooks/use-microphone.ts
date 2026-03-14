import { useState, useCallback, useRef } from "react";

interface UseMicrophoneReturn {
  stream: MediaStream | null;
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
  isActive: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  getLevel: () => number;
}

export function useMicrophone(): UseMicrophoneReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const levelBuffer = useRef(new Float32Array(2048));

  const start = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
        },
      });

      const ctx = new AudioContext({ sampleRate: 44100 });
      const source = ctx.createMediaStreamSource(mediaStream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      setStream(mediaStream);
      setAudioContext(ctx);
      setAnalyserNode(analyser);
      setIsActive(true);
      setError(null);
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access denied. Please allow microphone access in your browser settings."
          : "Failed to access microphone.";
      setError(msg);
    }
  }, []);

  const stop = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    audioContext?.close();
    setStream(null);
    setAudioContext(null);
    setAnalyserNode(null);
    setIsActive(false);
  }, [stream, audioContext]);

  const getLevel = useCallback((): number => {
    if (!analyserNode) return 0;
    analyserNode.getFloatTimeDomainData(levelBuffer.current);
    let sum = 0;
    for (let i = 0; i < levelBuffer.current.length; i++) {
      sum += levelBuffer.current[i] * levelBuffer.current[i];
    }
    return Math.sqrt(sum / levelBuffer.current.length);
  }, [analyserNode]);

  return { stream, audioContext, analyserNode, isActive, error, start, stop, getLevel };
}
