const NOTE_FREQUENCIES: Record<string, number> = {
  C2: 65.41, "C#2": 69.3, D2: 73.42, "D#2": 77.78, E2: 82.41, F2: 87.31,
  "F#2": 92.5, G2: 98.0, "G#2": 103.83, A2: 110.0, "A#2": 116.54, B2: 123.47,
  C3: 130.81, "C#3": 138.59, D3: 146.83, "D#3": 155.56, E3: 164.81, F3: 174.61,
  "F#3": 185.0, G3: 196.0, "G#3": 207.65, A3: 220.0, "A#3": 233.08, B3: 246.94,
  C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13, E4: 329.63, F4: 349.23,
  "F#4": 369.99, G4: 392.0, "G#4": 415.3, A4: 440.0, "A#4": 466.16, B4: 493.88,
  C5: 523.25, "C#5": 554.37, D5: 587.33, "D#5": 622.25, E5: 659.26, F5: 698.46,
  "F#5": 739.99, G5: 783.99, "G#5": 830.61, A5: 880.0, "A#5": 932.33, B5: 987.77,
};

export function noteToFrequency(note: string): number | null {
  return NOTE_FREQUENCIES[note] ?? null;
}

export function frequencyToNearestNote(freq: number): string {
  let closest = "A4";
  let minDiff = Infinity;
  for (const [note, f] of Object.entries(NOTE_FREQUENCIES)) {
    const diff = Math.abs(freq - f);
    if (diff < minDiff) {
      minDiff = diff;
      closest = note;
    }
  }
  return closest;
}

export function centsFromTarget(frequency: number, targetNote: string): number {
  const targetFreq = noteToFrequency(targetNote);
  if (!targetFreq || frequency <= 0) return 0;
  return 1200 * Math.log2(frequency / targetFreq);
}

export function pitchAccuracyScore(frequency: number, targetNote: string): number {
  const cents = Math.abs(centsFromTarget(frequency, targetNote));
  if (cents > 100) return 0;
  return Math.max(0, 1 - cents / 50);
}
