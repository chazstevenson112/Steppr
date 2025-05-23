import { z } from "zod";
import { publicProcedure } from "../../create-context";

const createChallengeSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['total_steps_goal', 'daily_average_goal']),
  targetSteps: z.number().positive(),
  duration: z.number().min(1).max(365), // days
  creatorId: z.string(),
});

export const createChallengeProcedure = publicProcedure
  .input(createChallengeSchema)
  .mutation(async ({ input }) => {
    // Generate unique invite code
    const generateInviteCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + input.duration);

    const challenge = {
      id: `challenge_${Date.now()}`,
      name: input.name,
      type: input.type,
      targetSteps: input.targetSteps,
      duration: input.duration,
      startDate,
      endDate,
      creatorId: input.creatorId,
      participants: [
        {
          id: input.creatorId,
          name: 'You',
          steps: 0,
          joinedAt: new Date(),
        }
      ],
      inviteCode: generateInviteCode(),
      status: 'active' as const,
      createdAt: new Date(),
    };

    // In a real app, this would save to Firestore
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      challenge,
      message: `Challenge "${input.name}" created successfully!`,
    };
  });