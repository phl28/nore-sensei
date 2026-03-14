import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    skillLevel: v.union(v.literal("beginner"), v.literal("intermediate")),
    betterAuthUserId: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_better_auth_id", ["betterAuthUserId"]),

  lessons: defineTable({
    title: v.string(),
    description: v.string(),
    technique: v.string(),
    difficulty: v.number(),
    exercises: v.array(
      v.object({
        title: v.string(),
        instructions: v.string(),
        targetNote: v.optional(v.string()),
        durationSeconds: v.number(),
        focusMetrics: v.array(v.string()),
      })
    ),
    order: v.number(),
  }).index("by_order", ["order"]),

  practiceSessions: defineTable({
    userId: v.id("users"),
    lessonId: v.optional(v.id("lessons")),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  exerciseResults: defineTable({
    sessionId: v.id("practiceSessions"),
    exerciseIndex: v.number(),
    audioMetrics: v.object({
      pitchAccuracy: v.number(),
      pitchStability: v.number(),
      rmsStability: v.number(),
      breathiness: v.number(),
    }),
    videoMetrics: v.object({
      shoulderElevation: v.number(),
      jawOpenAngle: v.number(),
      spineAlignment: v.number(),
      ribcageExpansion: v.number(),
    }),
    aiFeedback: v.string(),
    overallScore: v.number(),
  }).index("by_session", ["sessionId"]),
});
