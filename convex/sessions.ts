import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const start = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.optional(v.id("lessons")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("practiceSessions", {
      userId: args.userId,
      lessonId: args.lessonId,
      startedAt: Date.now(),
    });
  },
});

export const end = mutation({
  args: { sessionId: v.id("practiceSessions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { endedAt: Date.now() });
  },
});

export const saveExerciseResult = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exerciseResults", args);
  },
});

export const getResults = query({
  args: { sessionId: v.id("practiceSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exerciseResults")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});
