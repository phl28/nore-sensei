import { useState, useEffect, useRef, useCallback } from "react";
import { PitchDetector } from "pitchy";

interface PitchData {
  frequency: number;
  clarity: number;
  note: string;
  cents: number;
}

interface UsePitchDetectionReturn {
  pitch: PitchData | null;
  isDetecting: boolean;
  start: () => void;
  stop: () => void;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function frequencyToNote(freq: number): { note: string; cents: number } {
  const semitones = 12 * Math.log2(freq / 440);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = Math.floor((rounded + 69) / 12);
  return { note: `${NOTE_NAMES[(noteIndex + 9) % 12]}${octave}`, cents };
}

export function usePitchDetection(
  analyserNode: AnalyserNode | null,
  audioContext: AudioContext | null
): UsePitchDetectionReturn {
  const [pitch, setPitch] = useState<PitchData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const rafRef = useRef<number>(0);
  const detectorRef = useRef<PitchDetector<Float32Array<ArrayBuffer>> | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);

  const detect = useCallback(() => {
    if (!analyserNode || !detectorRef.current || !bufferRef.current) return;

    analyserNode.getFloatTimeDomainData(bufferRef.current);
    const [frequency, clarity] = detectorRef.current.findPitch(
      bufferRef.current,
      audioContext!.sampleRate
    );

    if (clarity > 0.85 && frequency > 50 && frequency < 2000) {
      const { note, cents } = frequencyToNote(frequency);
      setPitch({ frequency, clarity, note, cents });
    } else {
      setPitch(null);
    }

    rafRef.current = requestAnimationFrame(detect);
  }, [analyserNode, audioContext]);

  const start = useCallback(() => {
    if (!analyserNode || !audioContext) return;

    const bufferLength = analyserNode.fftSize;
    bufferRef.current = new Float32Array(bufferLength);
    detectorRef.current = PitchDetector.forFloat32Array(bufferLength);
    setIsDetecting(true);
    rafRef.current = requestAnimationFrame(detect);
  }, [analyserNode, audioContext, detect]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsDetecting(false);
    setPitch(null);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return { pitch, isDetecting, start, stop };
}
