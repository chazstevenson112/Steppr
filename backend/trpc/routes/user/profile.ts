import { z } from "zod";
import { publicProcedure } from "../../create-context";

const getUserProfileSchema = z.object({
  userId: z.string(),
});

const updateUserProfileSchema = z.object({
  userId: z.string(),
  displayName: z.string().optional(),
  dailyStepGoal: z.number().positive().optional(),
  photoURL: z.string().optional(),
});

export const getUserProfileProcedure = publicProcedure
  .input(getUserProfileSchema)
  .query(async ({ input }) => {
    // In a real app, this would query Firestore for user profile
    
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      user: {
        id: input.userId,
        displayName: 'Demo User',
        email: 'demo@steppr.com',
        dailyStepGoal: 10000,
        totalSteps: 156789,
        activeChallenges: 2,
        completedChallenges: 5,
        photoURL: null,
        createdAt: new Date(),
      },
    };
  });

export const updateUserProfileProcedure = publicProcedure
  .input(updateUserProfileSchema)
  .mutation(async ({ input }) => {
    // In a real app, this would update user profile in Firestore
    
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: input.userId,
        displayName: input.displayName || 'Demo User',
        dailyStepGoal: input.dailyStepGoal || 10000,
        photoURL: input.photoURL || null,
      },
    };
  });