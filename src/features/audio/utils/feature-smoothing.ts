export class ExponentialSmoothing {
  private value: number;
  private alpha: number;
  private initialized = false;

  constructor(alpha = 0.3) {
    this.alpha = alpha;
    this.value = 0;
  }

  push(sample: number): number {
    if (!this.initialized) {
      this.value = sample;
      this.initialized = true;
    } else {
      this.value = this.alpha * sample + (1 - this.alpha) * this.value;
    }
    return this.value;
  }

  get current(): number {
    return this.value;
  }

  reset() {
    this.initialized = false;
    this.value = 0;
  }
}

export class StabilityTracker {
  private samples: number[] = [];
  private maxSamples: number;

  constructor(windowSize = 20) {
    this.maxSamples = windowSize;
  }

  push(sample: number) {
    this.samples.push(sample);
    if (this.samples.length > this.maxSamples) this.samples.shift();
  }

  get stability(): number {
    if (this.samples.length < 3) return 0;
    const mean = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    const variance =
      this.samples.reduce((sum, s) => sum + (s - mean) ** 2, 0) /
      this.samples.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean !== 0 ? stdDev / Math.abs(mean) : 1;
    return Math.max(0, Math.min(1, 1 - cv));
  }

  reset() {
    this.samples.length = 0;
  }
}
