import { z } from "zod";
import { publicProcedure } from "../../create-context";

const createActivitySchema = z.object({
  type: z.enum(['walking', 'running', 'cycling', 'swimming', 'yoga', 'hiking', 'dancing', 'weightlifting']),
  quantity: z.number().positive(),
  unit: z.enum(['steps', 'km', 'minutes']),
  date: z.date().optional(),
  userId: z.string(),
});

export const createActivityProcedure = publicProcedure
  .input(createActivitySchema)
  .mutation(async ({ input }) => {
    // Step conversion logic
    const convertToSteps = (type: string, quantity: number, unit: string): number => {
      switch (type) {
        case 'walking':
          return unit === 'steps' ? quantity : quantity * 1300; // ~1300 steps per km
        case 'running':
          return unit === 'km' ? quantity * 1400 : quantity * 120; // ~1400 steps per km or 120 per minute
        case 'cycling':
          return unit === 'km' ? quantity * 600 : quantity * 80; // ~600 steps per km or 80 per minute
        case 'swimming':
          return quantity * 100; // ~100 steps per minute
        case 'yoga':
          return quantity * 50; // ~50 steps per minute
        case 'hiking':
          return unit === 'km' ? quantity * 1500 : quantity * 100; // ~1500 steps per km
        case 'dancing':
          return quantity * 120; // ~120 steps per minute
        case 'weightlifting':
          return quantity * 80; // ~80 steps per minute
        default:
          return quantity;
      }
    };

    const steps = convertToSteps(input.type, input.quantity, input.unit);
    
    // In a real app, this would save to Firestore
    const activity = {
      id: `activity_${Date.now()}`,
      type: input.type,
      originalQuantity: input.quantity,
      originalUnit: input.unit,
      steps,
      date: input.date || new Date(),
      userId: input.userId,
      createdAt: new Date(),
    };

    // Simulate database save
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      activity,
      message: `Activity logged! Converted to ${steps.toLocaleString()} steps.`,
    };
  });