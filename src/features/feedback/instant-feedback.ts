import type { AudioMetrics, VideoMetrics, InstantCue } from "./types";

interface CueRule {
  id: string;
  metric: string;
  check: (audio: AudioMetrics, video: VideoMetrics) => boolean;
  message: string;
  severity: InstantCue["severity"];
  priority: number;
}

const RULES: CueRule[] = [
  {
    id: "shoulders-high",
    metric: "shoulderElevation",
    check: (_, v) => v.shoulderElevation > 0.7,
    message: "Relax your shoulders down",
    severity: "correction",
    priority: 1,
  },
  {
    id: "spine-slouch",
    metric: "spineAlignment",
    check: (_, v) => v.spineAlignment < 0.45,
    message: "Stand tall — straighten up",
    severity: "correction",
    priority: 2,
  },
  {
    id: "jaw-closed",
    metric: "jawOpenAngle",
    check: (_, v) => v.jawOpenAngle < 0.35,
    message: "Open your mouth more",
    severity: "correction",
    priority: 3,
  },
  {
    id: "shallow-breath",
    metric: "ribcageExpansion",
    check: (_, v) => v.ribcageExpansion < 0.35,
    message: "Breathe deeper — expand your belly",
    severity: "correction",
    priority: 4,
  },
  {
    id: "pitch-drift",
    metric: "pitchAccuracy",
    check: (a) => a.pitchAccuracy < 0.5 && a.pitchAccuracy > 0,
    message: "Pitch drifting — find the center",
    severity: "warning",
    priority: 5,
  },
  {
    id: "unsteady-air",
    metric: "rmsStability",
    check: (a) => a.rmsStability < 0.4,
    message: "Steady your airflow",
    severity: "warning",
    priority: 6,
  },
  {
    id: "breathy-tone",
    metric: "breathiness",
    check: (a) => a.breathiness < 0.35,
    message: "More core support — less air",
    severity: "info",
    priority: 7,
  },
];

const PERSISTENCE_THRESHOLD_MS = 600;

const activeTimers = new Map<string, number>();

export function evaluateInstantFeedback(
  audio: AudioMetrics,
  video: VideoMetrics,
  now: number = Date.now()
): InstantCue | null {
  const triggered: CueRule[] = [];

  for (const rule of RULES) {
    if (rule.check(audio, video)) {
      const firstSeen = activeTimers.get(rule.id);
      if (firstSeen === undefined) {
        activeTimers.set(rule.id, now);
      } else if (now - firstSeen >= PERSISTENCE_THRESHOLD_MS) {
        triggered.push(rule);
      }
    } else {
      activeTimers.delete(rule.id);
    }
  }

  if (triggered.length === 0) return null;

  triggered.sort((a, b) => a.priority - b.priority);
  const top = triggered[0];

  return {
    id: top.id,
    message: top.message,
    severity: top.severity,
    metric: top.metric,
  };
}

export function resetInstantFeedback() {
  activeTimers.clear();
}
