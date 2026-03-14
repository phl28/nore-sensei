import { useEffect, useRef } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

interface PostureOverlayProps {
  landmarks: NormalizedLandmark[] | null;
  metrics: {
    shoulderElevation: number;
    spineAlignment: number;
    ribcageExpansion: number;
  };
  width: number;
  height: number;
}

const SKELETON_CONNECTIONS: [number, number][] = [
  [11, 12], // shoulders
  [11, 23], // left torso
  [12, 24], // right torso
  [23, 24], // hips
  [11, 13], // left upper arm
  [13, 15], // left forearm
  [12, 14], // right upper arm
  [14, 16], // right forearm
];

const SPINE_POINTS = [
  [11, 12], // shoulder midpoint
  [23, 24], // hip midpoint
];

function lerpColor(good: boolean): string {
  return good ? "rgba(74, 222, 128, 0.7)" : "rgba(248, 113, 113, 0.6)";
}

export function PostureOverlay({
  landmarks,
  metrics,
  width,
  height,
}: PostureOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarks) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const postureGood = metrics.spineAlignment > 0.6;
    const shouldersGood = metrics.shoulderElevation < 0.6;

    // Draw skeleton connections
    for (const [i, j] of SKELETON_CONNECTIONS) {
      const a = landmarks[i];
      const b = landmarks[j];
      if (!a || !b) continue;

      const isShoulderLine = (i === 11 && j === 12);
      const color = isShoulderLine ? lerpColor(shouldersGood) : lerpColor(postureGood);

      ctx.beginPath();
      ctx.moveTo(a.x * width, a.y * height);
      ctx.lineTo(b.x * width, b.y * height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Draw spine line (midpoint shoulder to midpoint hip)
    const shoulderMid = {
      x: (landmarks[SPINE_POINTS[0][0]].x + landmarks[SPINE_POINTS[0][1]].x) / 2,
      y: (landmarks[SPINE_POINTS[0][0]].y + landmarks[SPINE_POINTS[0][1]].y) / 2,
    };
    const hipMid = {
      x: (landmarks[SPINE_POINTS[1][0]].x + landmarks[SPINE_POINTS[1][1]].x) / 2,
      y: (landmarks[SPINE_POINTS[1][0]].y + landmarks[SPINE_POINTS[1][1]].y) / 2,
    };

    ctx.beginPath();
    ctx.moveTo(shoulderMid.x * width, shoulderMid.y * height);
    ctx.lineTo(hipMid.x * width, hipMid.y * height);
    ctx.strokeStyle = lerpColor(postureGood);
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw key landmark dots
    const keyPoints = [11, 12, 23, 24];
    for (const idx of keyPoints) {
      const pt = landmarks[idx];
      if (!pt) continue;

      const isShoulderPt = idx === 11 || idx === 12;
      const good = isShoulderPt ? shouldersGood : postureGood;

      ctx.beginPath();
      ctx.arc(pt.x * width, pt.y * height, 5, 0, Math.PI * 2);
      ctx.fillStyle = good ? "rgba(74, 222, 128, 0.9)" : "rgba(248, 113, 113, 0.8)";
      ctx.fill();

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(pt.x * width, pt.y * height, 8, 0, Math.PI * 2);
      ctx.strokeStyle = good ? "rgba(74, 222, 128, 0.3)" : "rgba(248, 113, 113, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [landmarks, metrics, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ width, height }}
    />
  );
}
