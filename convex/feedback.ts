import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const SYSTEM_PROMPT = `You are Nore Sensei, an expert vocal technique coach. You analyze singing technique data from camera and microphone sensors and provide brief, encouraging coaching feedback.

RULES:
- Give 2-3 sentences maximum
- Lead with the most important correction
- Use simple, non-technical language (no jargon like "diaphragmatic" — say "belly breathing")
- Be encouraging but honest
- Focus on ONE thing the student can improve right now
- If metrics are good, acknowledge progress specifically

METRIC RANGES (0-1 scale, higher = better):
- pitchAccuracy: How close to target note (>0.8 = good)
- pitchStability: How steady the pitch is (>0.7 = good)
- rmsStability: How consistent the volume is (>0.7 = good)
- breathiness: Inverse — lower = more breathy/airy (>0.6 = good)
- shoulderElevation: Higher = shoulders are UP which is BAD (>0.7 = problem)
- jawOpenAngle: How open the jaw is (>0.5 = good for singing)
- spineAlignment: How aligned posture is (>0.7 = good)
- ribcageExpansion: Breathing depth (>0.5 = good)`;

export const generateFeedback = action({
  args: {
    sessionId: v.id("practiceSessions"),
    exerciseIndex: v.number(),
    exerciseTitle: v.string(),
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
  },
  handler: async (ctx, args) => {
    const { exerciseTitle, audioMetrics, videoMetrics } = args;

    const userPrompt = `Exercise: "${exerciseTitle}"

Audio metrics: ${JSON.stringify(audioMetrics)}
Video metrics: ${JSON.stringify(videoMetrics)}

Provide coaching feedback for this exercise attempt.`;

    let feedbackText: string;

    const apiKey = (globalThis as any).process?.env?.GEMINI_API_KEY as string | undefined;
    if (apiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { maxOutputTokens: 200 },
          }),
        }
      );

      const data = await response.json();
      feedbackText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Great effort! Keep practicing.";
    } else {
      feedbackText = generateFallbackFeedback(audioMetrics, videoMetrics);
    }

    const overallScore = calculateOverallScore(audioMetrics, videoMetrics);

    await ctx.runMutation(api.sessions.saveExerciseResult, {
      sessionId: args.sessionId,
      exerciseIndex: args.exerciseIndex,
      audioMetrics,
      videoMetrics,
      aiFeedback: feedbackText,
      overallScore,
    });

    return { feedback: feedbackText, overallScore };
  },
});

function calculateOverallScore(
  audio: { pitchAccuracy: number; pitchStability: number; rmsStability: number; breathiness: number },
  video: { shoulderElevation: number; jawOpenAngle: number; spineAlignment: number; ribcageExpansion: number }
): number {
  const audioScore =
    audio.pitchAccuracy * 0.3 +
    audio.pitchStability * 0.2 +
    audio.rmsStability * 0.2 +
    audio.breathiness * 0.3;

  const videoScore =
    (1 - video.shoulderElevation) * 0.3 +
    video.jawOpenAngle * 0.2 +
    video.spineAlignment * 0.3 +
    video.ribcageExpansion * 0.2;

  return Math.round((audioScore * 0.5 + videoScore * 0.5) * 100) / 100;
}

function generateFallbackFeedback(
  audio: { pitchAccuracy: number; pitchStability: number; rmsStability: number; breathiness: number },
  video: { shoulderElevation: number; jawOpenAngle: number; spineAlignment: number; ribcageExpansion: number }
): string {
  const issues: string[] = [];

  if (video.shoulderElevation > 0.7)
    issues.push("Your shoulders are creeping up — try to relax them down and back.");
  if (video.spineAlignment < 0.5)
    issues.push("Check your posture — stand tall with your weight balanced.");
  if (video.jawOpenAngle < 0.4)
    issues.push("Open your mouth more! Think of a relaxed yawn.");
  if (video.ribcageExpansion < 0.4)
    issues.push("Try deeper belly breaths — let your ribcage expand sideways.");
  if (audio.pitchAccuracy < 0.6)
    issues.push("The pitch wandered a bit — take your time finding the note before committing.");
  if (audio.rmsStability < 0.5)
    issues.push("Your volume was uneven — focus on a steady stream of air.");
  if (audio.breathiness < 0.4)
    issues.push("The tone sounds airy — engage your core for more support.");

  if (issues.length === 0)
    return "Excellent work! Your technique is solid on this one. Keep building on this foundation.";

  return issues.slice(0, 2).join(" ");
}
