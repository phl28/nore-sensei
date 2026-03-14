import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { calculateRibcageExpansion } from "./pose-metrics";

export class BreathingDetector {
  private samples: number[] = [];
  private baseline: number | null = null;
  private readonly windowSize: number;
  private calibrationSamples: number[] = [];
  private calibrated = false;

  constructor(windowSize = 60) {
    this.windowSize = windowSize;
  }

  calibrate(landmarks: NormalizedLandmark[]) {
    const expansion = calculateRibcageExpansion(landmarks);
    this.calibrationSamples.push(expansion);

    if (this.calibrationSamples.length >= 30) {
      const sorted = [...this.calibrationSamples].sort((a, b) => a - b);
      this.baseline = sorted[Math.floor(sorted.length * 0.25)];
      this.calibrated = true;
    }
  }

  push(landmarks: NormalizedLandmark[]): number {
    const expansion = calculateRibcageExpansion(landmarks, this.baseline ?? undefined);
    this.samples.push(expansion);
    if (this.samples.length > this.windowSize) this.samples.shift();
    return expansion;
  }

  get isCalibrated(): boolean {
    return this.calibrated;
  }

  get currentExpansion(): number {
    if (this.samples.length === 0) return 0;
    return this.samples[this.samples.length - 1];
  }

  get breathingDepth(): number {
    if (this.samples.length < 10) return 0;
    const min = Math.min(...this.samples);
    const max = Math.max(...this.samples);
    return max - min;
  }

  reset() {
    this.samples.length = 0;
    this.calibrationSamples.length = 0;
    this.baseline = null;
    this.calibrated = false;
  }
}
