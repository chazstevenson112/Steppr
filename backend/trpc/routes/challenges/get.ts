import { z } from "zod";
import { publicProcedure } from "../../create-context";

const getChallengeSchema = z.object({
  challengeId: z.string(),
  userId: z.string(),
});

export const getChallengeProcedure = publicProcedure
  .input(getChallengeSchema)
  .query(async ({ input }) => {
    // In a real app, this would query Firestore for the specific challenge
    
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock challenge data
    const mockChallenge = {
      id: input.challengeId,
      name: 'Weekend Warrior',
      type: 'total_steps_goal' as const,
      targetSteps: 25000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 172800000),
      participants: [
        { id: 'user1', name: 'You', steps: 8500, photoURL: null },
        { id: 'user2', name: 'Sarah', steps: 12000, photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
        { id: 'user3', name: 'Mike', steps: 6300, photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100' },
      ],
      status: 'active' as const,
      inviteCode: 'WEEKEND1',
      createdAt: new Date(),
    };

    return {
      challenge: mockChallenge,
    };
  });