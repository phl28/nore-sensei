import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("practiceSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getSessionResults = query({
  args: { sessionId: v.id("practiceSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exerciseResults")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("practiceSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const completedSessions = sessions.filter((s) => s.endedAt);

    const allResults = await Promise.all(
      completedSessions.map((session) =>
        ctx.db
          .query("exerciseResults")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect()
      )
    );

    const flatResults = allResults.flat();
    const avgScore =
      flatResults.length > 0
        ? flatResults.reduce((sum, r) => sum + r.overallScore, 0) /
          flatResults.length
        : 0;

    return {
      totalSessions: completedSessions.length,
      totalExercises: flatResults.length,
      averageScore: Math.round(avgScore * 100) / 100,
      recentSessions: completedSessions.slice(0, 10),
    };
  },
});
