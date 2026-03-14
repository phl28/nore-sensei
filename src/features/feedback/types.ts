export interface AudioMetrics {
  pitchAccuracy: number;
  pitchStability: number;
  rmsStability: number;
  breathiness: number;
}

export interface VideoMetrics {
  shoulderElevation: number;
  jawOpenAngle: number;
  spineAlignment: number;
  ribcageExpansion: number;
}

export interface FeatureSnapshot {
  timestamp: number;
  audio: AudioMetrics;
  video: VideoMetrics;
}

export interface InstantCue {
  id: string;
  message: string;
  severity: "info" | "warning" | "correction";
  metric: string;
}

export interface CoachingFeedback {
  feedback: string;
  overallScore: number;
  timestamp: number;
}
