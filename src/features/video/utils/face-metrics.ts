import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Face Mesh landmark indices for jaw measurement
const UPPER_LIP = 13;
const LOWER_LIP = 14;
const CHIN = 152;
const FOREHEAD = 10;

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function calculateJawOpenAngle(landmarks: NormalizedLandmark[]): number {
  const upperLip = landmarks[UPPER_LIP];
  const lowerLip = landmarks[LOWER_LIP];
  const chin = landmarks[CHIN];
  const forehead = landmarks[FOREHEAD];

  const mouthOpening = distance(upperLip, lowerLip);
  const faceHeight = distance(forehead, chin);

  // Normalize mouth opening relative to face height.
  // Typical range: 0.02 (closed) to 0.15+ (wide open)
  const ratio = mouthOpening / (faceHeight || 0.001);
  return Math.max(0, Math.min(1, ratio / 0.12));
}

export interface FaceMetricsResult {
  jawOpenAngle: number;
}

export function calculateFaceMetrics(landmarks: NormalizedLandmark[]): FaceMetricsResult {
  return {
    jawOpenAngle: calculateJawOpenAngle(landmarks),
  };
}
