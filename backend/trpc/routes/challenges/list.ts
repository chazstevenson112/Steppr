import { z } from "zod";
import { publicProcedure } from "../../create-context";

const listChallengesSchema = z.object({
  userId: z.string(),
  status: z.enum(['active', 'completed', 'all']).default('all'),
});

export const listChallengesProcedure = publicProcedure
  .input(listChallengesSchema)
  .query(async ({ input }) => {
    // In a real app, this would query Firestore for challenges where user is a participant
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockChallenges = [
      {
        id: 'challenge_1',
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
      },
      {
        id: 'challenge_2',
        name: 'Monthly Challenge',
        type: 'daily_average_goal' as const,
        targetSteps: 10000,
        startDate: new Date(Date.now() - 1209600000),
        endDate: new Date(Date.now() + 1209600000),
        participants: [
          { id: 'user1', name: 'You', steps: 98000, photoURL: null },
          { id: 'user2', name: 'Sarah', steps: 112000, photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
          { id: 'user3', name: 'Mike', steps: 86000, photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100' },
          { id: 'user4', name: 'Emma', steps: 105000, photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100' },
        ],
        status: 'active' as const,
        inviteCode: 'MONTHLY1',
      },
    ];

    const filteredChallenges = input.status === 'all' 
      ? mockChallenges 
      : mockChallenges.filter(challenge => challenge.status === input.status);

    return {
      challenges: filteredChallenges,
      total: filteredChallenges.length,
    };
  });