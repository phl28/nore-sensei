import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// MediaPipe Pose landmark indices
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;
const LEFT_EAR = 7;
const RIGHT_EAR = 8;

function midpoint(a: NormalizedLandmark, b: NormalizedLandmark) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function calculateShoulderElevation(landmarks: NormalizedLandmark[]): number {
  const leftShoulder = landmarks[LEFT_SHOULDER];
  const rightShoulder = landmarks[RIGHT_SHOULDER];
  const leftEar = landmarks[LEFT_EAR];
  const rightEar = landmarks[RIGHT_EAR];

  const shoulderMid = midpoint(leftShoulder, rightShoulder);
  const earMid = midpoint(leftEar, rightEar);

  const neckLength = distance(shoulderMid, earMid);

  // Shorter neck distance = shoulders raised. Normalize to 0-1 range.
  // Typical relaxed neck distance is ~0.15-0.25 in normalized coords.
  const normalized = Math.max(0, Math.min(1, 1 - (neckLength - 0.05) / 0.2));
  return normalized;
}

export function calculateSpineAlignment(landmarks: NormalizedLandmark[]): number {
  const shoulderMid = midpoint(landmarks[LEFT_SHOULDER], landmarks[RIGHT_SHOULDER]);
  const hipMid = midpoint(landmarks[LEFT_HIP], landmarks[RIGHT_HIP]);

  const lateralOffset = Math.abs(shoulderMid.x - hipMid.x);

  // Perfect alignment = shoulders directly above hips (zero lateral offset).
  // Normalize: small offset = good alignment.
  return Math.max(0, Math.min(1, 1 - lateralOffset / 0.1));
}

export function calculateRibcageExpansion(
  landmarks: NormalizedLandmark[],
  baseline?: number
): number {
  const shoulderWidth = distance(landmarks[LEFT_SHOULDER], landmarks[RIGHT_SHOULDER]);
  const hipWidth = distance(landmarks[LEFT_HIP], landmarks[RIGHT_HIP]);

  const torsoRatio = shoulderWidth / (hipWidth || 0.001);

  if (baseline) {
    const expansion = (torsoRatio - baseline) / baseline;
    return Math.max(0, Math.min(1, expansion * 10 + 0.5));
  }

  // Without baseline, use absolute ratio heuristic
  return Math.max(0, Math.min(1, (torsoRatio - 1.0) / 0.5));
}

export interface PoseMetricsResult {
  shoulderElevation: number;
  spineAlignment: number;
  ribcageExpansion: number;
}

export function calculatePoseMetrics(
  landmarks: NormalizedLandmark[],
  ribcageBaseline?: number
): PoseMetricsResult {
  return {
    shoulderElevation: calculateShoulderElevation(landmarks),
    spineAlignment: calculateSpineAlignment(landmarks),
    ribcageExpansion: calculateRibcageExpansion(landmarks, ribcageBaseline),
  };
}
