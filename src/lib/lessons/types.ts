import type { Id } from "../../../convex/_generated/dataModel";

export interface Exercise {
  title: string;
  instructions: string;
  targetNote?: string;
  durationSeconds: number;
  focusMetrics: string[];
}

export interface Lesson {
  _id: Id<"lessons">;
  title: string;
  description: string;
  technique: string;
  difficulty: number;
  exercises: Exercise[];
  order: number;
}

export type ExercisePhase = "instructions" | "countdown" | "active" | "feedback";
