import type { AudioMetrics, VideoMetrics, FeatureSnapshot } from "./types";

const WINDOW_SIZE = 30;

interface MetricBuffer {
  audio: AudioMetrics[];
  video: VideoMetrics[];
}

const buffer: MetricBuffer = {
  audio: [],
  video: [],
};

export function pushAudioFrame(metrics: AudioMetrics) {
  buffer.audio.push(metrics);
  if (buffer.audio.length > WINDOW_SIZE) buffer.audio.shift();
}

export function pushVideoFrame(metrics: VideoMetrics) {
  buffer.video.push(metrics);
  if (buffer.video.length > WINDOW_SIZE) buffer.video.shift();
}

export function takeSnapshot(): FeatureSnapshot {
  return {
    timestamp: Date.now(),
    audio: averageAudio(buffer.audio),
    video: averageVideo(buffer.video),
  };
}

export function resetBuffer() {
  buffer.audio.length = 0;
  buffer.video.length = 0;
}

function averageAudio(frames: AudioMetrics[]): AudioMetrics {
  if (frames.length === 0) {
    return { pitchAccuracy: 0, pitchStability: 0, rmsStability: 0, breathiness: 0 };
  }
  const n = frames.length;
  return {
    pitchAccuracy: frames.reduce((s, f) => s + f.pitchAccuracy, 0) / n,
    pitchStability: frames.reduce((s, f) => s + f.pitchStability, 0) / n,
    rmsStability: frames.reduce((s, f) => s + f.rmsStability, 0) / n,
    breathiness: frames.reduce((s, f) => s + f.breathiness, 0) / n,
  };
}

function averageVideo(frames: VideoMetrics[]): VideoMetrics {
  if (frames.length === 0) {
    return { shoulderElevation: 0, jawOpenAngle: 0, spineAlignment: 0, ribcageExpansion: 0 };
  }
  const n = frames.length;
  return {
    shoulderElevation: frames.reduce((s, f) => s + f.shoulderElevation, 0) / n,
    jawOpenAngle: frames.reduce((s, f) => s + f.jawOpenAngle, 0) / n,
    spineAlignment: frames.reduce((s, f) => s + f.spineAlignment, 0) / n,
    ribcageExpansion: frames.reduce((s, f) => s + f.ribcageExpansion, 0) / n,
  };
}
