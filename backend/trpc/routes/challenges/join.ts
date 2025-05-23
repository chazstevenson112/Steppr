import { z } from "zod";
import { publicProcedure } from "../../create-context";

const joinChallengeSchema = z.object({
  inviteCode: z.string().length(8),
  userId: z.string(),
  userName: z.string(),
});

export const joinChallengeProcedure = publicProcedure
  .input(joinChallengeSchema)
  .mutation(async ({ input }) => {
    // In a real app, this would:
    // 1. Find challenge by invite code
    // 2. Check if user is already a participant
    // 3. Add user to participants array
    // 4. Update challenge in Firestore

    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response
    return {
      success: true,
      message: `Successfully joined challenge!`,
      challengeId: `challenge_${Date.now()}`,
    };
  });