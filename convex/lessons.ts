import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("lessons").withIndex("by_order").collect();
  },
});

export const get = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId);
  },
});

export const seed = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("lessons").first();
    if (existing) return "Lessons already seeded";

    await ctx.db.insert("lessons", {
      title: "Breathing & Posture",
      description:
        "Learn the foundation of great singing: proper breathing technique and body alignment. No singing required — just breathe correctly.",
      technique: "breath-support",
      difficulty: 1,
      order: 1,
      exercises: [
        {
          title: "Posture Check",
          instructions:
            "Stand tall with feet shoulder-width apart. Roll your shoulders back and down. Keep your chin parallel to the floor. Hold this position.",
          durationSeconds: 30,
          focusMetrics: ["shoulderElevation", "spineAlignment"],
        },
        {
          title: "Diaphragmatic Breathing",
          instructions:
            "Place one hand on your chest, one on your belly. Breathe in slowly through your nose — your belly should expand while your chest stays still. Exhale slowly through pursed lips.",
          durationSeconds: 45,
          focusMetrics: ["ribcageExpansion", "shoulderElevation"],
        },
        {
          title: "Sustained Exhale",
          instructions:
            "Take a deep belly breath, then exhale on a steady 'sss' sound. Keep the airflow consistent — don't let it waver or run out too quickly. Aim for 15+ seconds.",
          durationSeconds: 30,
          focusMetrics: [
            "ribcageExpansion",
            "rmsStability",
            "spineAlignment",
          ],
        },
      ],
    });

    await ctx.db.insert("lessons", {
      title: "Sustained Single Note",
      description:
        "Hold a single note with steady airflow, open jaw, and relaxed posture. This builds the mind-body connection between technique and sound.",
      technique: "tone-production",
      difficulty: 2,
      order: 2,
      exercises: [
        {
          title: "Open Jaw Warm-up",
          instructions:
            "Drop your jaw open as if yawning. Keep your tongue relaxed and flat. Hold this open position while breathing deeply.",
          durationSeconds: 20,
          focusMetrics: ["jawOpenAngle", "shoulderElevation"],
        },
        {
          title: "Sustained 'Ah' on C4",
          instructions:
            "Take a deep breath and sing a steady 'Ah' on C4 (middle C). Focus on keeping your jaw open, shoulders down, and airflow steady. Don't worry about volume — focus on consistency.",
          targetNote: "C4",
          durationSeconds: 15,
          focusMetrics: [
            "pitchAccuracy",
            "pitchStability",
            "jawOpenAngle",
            "rmsStability",
          ],
        },
        {
          title: "Sustained 'Ah' on E4",
          instructions:
            "Same exercise, now on E4. As you go higher, resist the urge to tense your shoulders or close your jaw. Let the breath do the work.",
          targetNote: "E4",
          durationSeconds: 15,
          focusMetrics: [
            "pitchAccuracy",
            "pitchStability",
            "jawOpenAngle",
            "shoulderElevation",
          ],
        },
      ],
    });

    await ctx.db.insert("lessons", {
      title: "Simple Intervals",
      description:
        "Sing simple two-note patterns while maintaining proper technique. This connects pitch accuracy with physical awareness.",
      technique: "pitch-control",
      difficulty: 3,
      order: 3,
      exercises: [
        {
          title: "C4 to E4 Slide",
          instructions:
            "Sing 'Ah' starting on C4, then smoothly slide up to E4. Keep your posture steady and jaw open throughout the transition.",
          targetNote: "C4",
          durationSeconds: 20,
          focusMetrics: [
            "pitchAccuracy",
            "spineAlignment",
            "jawOpenAngle",
            "breathiness",
          ],
        },
        {
          title: "C4 to G4 Step",
          instructions:
            "Sing C4 for 3 seconds, then step up to G4 for 3 seconds. Notice if your shoulders rise or jaw closes when reaching for the higher note.",
          targetNote: "C4",
          durationSeconds: 20,
          focusMetrics: [
            "pitchAccuracy",
            "pitchStability",
            "shoulderElevation",
            "jawOpenAngle",
          ],
        },
        {
          title: "Descending Pattern G4-E4-C4",
          instructions:
            "Sing each note for 3 seconds: G4, E4, C4. Descending is where singers often lose breath support. Keep the belly engaged and airflow steady.",
          targetNote: "G4",
          durationSeconds: 25,
          focusMetrics: [
            "pitchAccuracy",
            "ribcageExpansion",
            "rmsStability",
            "spineAlignment",
          ],
        },
      ],
    });

    return "Seeded 3 lessons";
  },
});
