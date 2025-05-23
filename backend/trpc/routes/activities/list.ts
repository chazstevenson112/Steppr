import { z } from "zod";
import { publicProcedure } from "../../create-context";

const listActivitiesSchema = z.object({
  userId: z.string(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  type: z.enum(['walking', 'running', 'cycling', 'swimming', 'yoga', 'hiking', 'dancing', 'weightlifting']).optional(),
});

export const listActivitiesProcedure = publicProcedure
  .input(listActivitiesSchema)
  .query(async ({ input }) => {
    // In a real app, this would query Firestore
    // For demo, return mock data
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockActivities = [
      {
        id: 'activity_1',
        type: 'walking',
        originalQuantity: 8500,
        originalUnit: 'steps',
        steps: 8500,
        date: new Date(),
        userId: input.userId,
      },
      {
        id: 'activity_2',
        type: 'running',
        originalQuantity: 3,
        originalUnit: 'km',
        steps: 4200,
        date: new Date(Date.now() - 86400000),
        userId: input.userId,
      },
      {
        id: 'activity_3',
        type: 'cycling',
        originalQuantity: 5,
        originalUnit: 'km',
        steps: 3000,
        date: new Date(Date.now() - 172800000),
        userId: input.userId,
      },
    ];

    const filteredActivities = input.type 
      ? mockActivities.filter(activity => activity.type === input.type)
      : mockActivities;

    const paginatedActivities = filteredActivities.slice(
      input.offset, 
      input.offset + input.limit
    );

    return {
      activities: paginatedActivities,
      total: filteredActivities.length,
      hasMore: input.offset + input.limit < filteredActivities.length,
    };
  });