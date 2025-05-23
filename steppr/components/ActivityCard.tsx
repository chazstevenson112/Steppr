import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/theme-context";

interface Activity {
  id: string;
  type: string;
  steps: number;
  date: Date;
}

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress }) => {
  const { theme } = useTheme();
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "walking":
        return "🚶";
      case "running":
        return "🏃";
      case "cycling":
        return "🚴";
      case "swimming":
        return "🏊";
      case "yoga":
        return "🧘";
      default:
        return "👟";
    }
  };

  const getActivityName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return "Today";
    } else if (date >= yesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={styles.icon}>{getActivityIcon(activity.type)}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.activityName, { color: theme.colors.textPrimary }]}>
            {getActivityName(activity.type)}
          </Text>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {formatDate(activity.date)}
          </Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.steps, { color: theme.colors.textPrimary }]}>
          {activity.steps.toLocaleString()}
        </Text>
        <Text style={[styles.stepsLabel, { color: theme.colors.textSecondary }]}>
          steps
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    gap: 4,
  },
  activityName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  date: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  steps: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  stepsLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
});