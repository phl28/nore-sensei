import { useEffect, useRef } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

interface FaceOverlayProps {
  landmarks: NormalizedLandmark[] | null;
  metrics: { jawOpenAngle: number };
  width: number;
  height: number;
}

const UPPER_LIP = 13;
const LOWER_LIP = 14;
const LEFT_MOUTH = 61;
const RIGHT_MOUTH = 291;
const JAW_OUTLINE = [
  234, 93, 132, 58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379,
  365, 397, 288, 361, 454,
];

export function FaceOverlay({ landmarks, metrics, width, height }: FaceOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarks) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const jawGood = metrics.jawOpenAngle > 0.45;
    const color = jawGood ? "rgba(74, 222, 128, 0.7)" : "rgba(248, 113, 113, 0.7)";

    // Draw jaw outline
    if (JAW_OUTLINE.every((i) => landmarks[i])) {
      ctx.beginPath();
      const first = landmarks[JAW_OUTLINE[0]];
      ctx.moveTo(first.x * width, first.y * height);
      for (let i = 1; i < JAW_OUTLINE.length; i++) {
        const pt = landmarks[JAW_OUTLINE[i]];
        ctx.lineTo(pt.x * width, pt.y * height);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw mouth opening indicator — line between upper and lower lip
    const upper = landmarks[UPPER_LIP];
    const lower = landmarks[LOWER_LIP];
    const left = landmarks[LEFT_MOUTH];
    const right = landmarks[RIGHT_MOUTH];

    if (upper && lower && left && right) {
      // Mouth corners
      ctx.beginPath();
      ctx.moveTo(left.x * width, left.y * height);
      ctx.lineTo(upper.x * width, upper.y * height);
      ctx.lineTo(right.x * width, right.y * height);
      ctx.lineTo(lower.x * width, lower.y * height);
      ctx.closePath();
      ctx.fillStyle = jawGood
        ? "rgba(74, 222, 128, 0.15)"
        : "rgba(248, 113, 113, 0.15)";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Opening distance line (vertical)
      ctx.beginPath();
      ctx.moveTo(upper.x * width, upper.y * height);
      ctx.lineTo(lower.x * width, lower.y * height);
      ctx.strokeStyle = jawGood
        ? "rgba(250, 204, 21, 0.8)"
        : "rgba(248, 113, 113, 0.8)";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dot at midpoint with label
      const midX = ((upper.x + lower.x) / 2) * width;
      const midY = ((upper.y + lower.y) / 2) * height;
      ctx.beginPath();
      ctx.arc(midX, midY, 3, 0, Math.PI * 2);
      ctx.fillStyle = jawGood ? "rgba(250, 204, 21, 0.9)" : "rgba(248, 113, 113, 0.9)";
      ctx.fill();
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
