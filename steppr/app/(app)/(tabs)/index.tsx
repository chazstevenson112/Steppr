import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { useHealthData } from "@/hooks/use-health-data";
import { useUserStore } from "@/stores/user-store";
import { CircularProgress } from "@/components/CircularProgress";
import { ActivityCard } from "@/components/ActivityCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { fetchTodaySteps, fetchWeeklySteps } = useHealthData();
  const { dailyStepGoal } = useUserStore();
  
  const [todaySteps, setTodaySteps] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivities, setRecentActivities] = useState([
    { id: '1', type: 'walking', steps: 2500, date: new Date() },
    { id: '2', type: 'running', steps: 4200, date: new Date(Date.now() - 86400000) },
    { id: '3', type: 'cycling', steps: 3800, date: new Date(Date.now() - 172800000) },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const steps = await fetchTodaySteps();
      setTodaySteps(steps);
      
      const weekly = await fetchWeeklySteps();
      setWeeklySteps(weekly);
    } catch (error) {
      console.error("Error loading health data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddActivity = () => {
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available
      }
    }
    router.push("/modal");
  };

  const progress = Math.min(todaySteps / dailyStepGoal, 1);
  const formattedSteps = todaySteps.toLocaleString();
  const formattedGoal = dailyStepGoal.toLocaleString();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.colors.textPrimary }]}>
            Hello, {user?.displayName?.split(" ")[0] || "there"}
          </Text>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </Text>
        </View>

        <View style={[styles.progressCard, { backgroundColor: theme.colors.card }]}>
          <CircularProgress
            progress={progress}
            size={180}
            strokeWidth={16}
            primaryColor={theme.colors.primary}
            secondaryColor={theme.colors.border}
          >
            <View style={styles.progressContent}>
              <Text style={[styles.stepsCount, { color: theme.colors.textPrimary }]}>
                {formattedSteps}
              </Text>
              <Text style={[styles.stepsLabel, { color: theme.colors.textSecondary }]}>
                / {formattedGoal} steps
              </Text>
            </View>
          </CircularProgress>
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleAddActivity}
          >
            <Plus size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Activity</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            This Week
          </Text>
          <WeeklyChart data={weeklySteps} goal={dailyStepGoal} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Recent Activities
          </Text>
          <View style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  progressCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  progressContent: {
    alignItems: "center",
  },
  stepsCount: {
    fontSize: 36,
    fontFamily: "Inter-Bold",
  },
  stepsLabel: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    marginBottom: 16,
  },
  activitiesList: {
    gap: 12,
  },
});