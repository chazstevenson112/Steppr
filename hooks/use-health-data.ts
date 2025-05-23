import { useState } from "react";
import { Platform } from "react-native";
import { useHealthPermissions } from "./use-health-permissions";

export const useHealthData = () => {
  const { permissionsGranted } = useHealthPermissions();
  const [loading, setLoading] = useState(false);

  const fetchTodaySteps = async (): Promise<number> => {
    if (Platform.OS === 'web' || !permissionsGranted) {
      // Return mock data for web or when permissions not granted
      return Math.floor(Math.random() * 5000) + 5000; // Random steps between 5000-10000
    }

    try {
      setLoading(true);

      // In a real implementation, this would use:
      // - Apple HealthKit for iOS: HKQuantityTypeIdentifier.stepCount
      // - Google Fit API for Android: DataType.TYPE_STEP_COUNT_DELTA
      
      // For now, simulate API call and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate realistic step count for today
      const baseSteps = 8000;
      const variation = Math.floor(Math.random() * 4000) - 2000; // ±2000 steps
      return Math.max(0, baseSteps + variation);
      
    } catch (error) {
      console.error("Error fetching today's steps:", error);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklySteps = async (): Promise<number[]> => {
    if (Platform.OS === 'web' || !permissionsGranted) {
      // Return mock data for web or when permissions not granted
      return Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000) + 5000);
    }

    try {
      setLoading(true);

      // In a real implementation, this would fetch the last 7 days of step data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate realistic weekly step data
      const weeklySteps = [];
      for (let i = 0; i < 7; i++) {
        const baseSteps = 8000;
        const variation = Math.floor(Math.random() * 4000) - 2000;
        weeklySteps.push(Math.max(0, baseSteps + variation));
      }
      
      return weeklySteps;
      
    } catch (error) {
      console.error("Error fetching weekly steps:", error);
      return [0, 0, 0, 0, 0, 0, 0];
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlySteps = async (): Promise<number[]> => {
    if (Platform.OS === 'web' || !permissionsGranted) {
      return Array.from({ length: 30 }, () => Math.floor(Math.random() * 5000) + 5000);
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const monthlySteps = [];
      for (let i = 0; i < 30; i++) {
        const baseSteps = 8000;
        const variation = Math.floor(Math.random() * 4000) - 2000;
        monthlySteps.push(Math.max(0, baseSteps + variation));
      }
      
      return monthlySteps;
      
    } catch (error) {
      console.error("Error fetching monthly steps:", error);
      return Array.from({ length: 30 }, () => 0);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchTodaySteps,
    fetchWeeklySteps,
    fetchMonthlySteps,
    loading,
  };
};