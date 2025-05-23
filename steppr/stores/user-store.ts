import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  dailyStepGoal: number;
  preferredUnits: {
    distance: "km" | "miles";
  };
  notificationPreferences: {
    challengeInvites: boolean;
    challengeUpdates: boolean;
    goalReminders: boolean;
  };
  updateDailyStepGoal: (goal: number) => void;
  updatePreferredUnits: (units: { distance: "km" | "miles" }) => void;
  updateNotificationPreferences: (preferences: Partial<UserState["notificationPreferences"]>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      dailyStepGoal: 10000,
      preferredUnits: {
        distance: "km",
      },
      notificationPreferences: {
        challengeInvites: true,
        challengeUpdates: true,
        goalReminders: false,
      },
      updateDailyStepGoal: (goal) => set({ dailyStepGoal: goal }),
      updatePreferredUnits: (units) => set({ preferredUnits: units }),
      updateNotificationPreferences: (preferences) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...preferences,
          },
        })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);