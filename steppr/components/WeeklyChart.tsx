import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/context/theme-context";

interface WeeklyChartProps {
  data: number[];
  goal: number;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, goal }) => {
  const { theme } = useTheme();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Get current day index (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();
  
  // Calculate max value for scaling
  const maxValue = Math.max(...data, goal);
  
  // Calculate bar height percentage based on max value
  const getBarHeight = (value: number) => {
    return value / maxValue * 100;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.chart}>
        {data.map((value, index) => {
          const isToday = index === today;
          const barHeight = getBarHeight(value);
          const goalHeight = getBarHeight(goal);
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                {/* Goal line */}
                <View 
                  style={[
                    styles.goalLine, 
                    { 
                      backgroundColor: theme.colors.textSecondary + '40',
                      bottom: `${goalHeight}%`,
                    }
                  ]} 
                />
                
                {/* Bar */}
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${barHeight}%`,
                      backgroundColor: isToday ? theme.colors.primary : theme.colors.primary + '80',
                    }
                  ]} 
                />
              </View>
              
              {/* Day label */}
              <Text 
                style={[
                  styles.dayLabel, 
                  { 
                    color: isToday ? theme.colors.primary : theme.colors.textSecondary,
                    fontFamily: isToday ? "Inter-SemiBold" : "Inter-Regular",
                  }
                ]}
              >
                {days[index]}
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
            Steps
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: theme.colors.textSecondary + '40' }]} />
          <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
            Daily Goal ({goal.toLocaleString()})
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    paddingBottom: 8,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    marginBottom: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  bar: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },
  goalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    zIndex: 1,
  },
  dayLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLine: {
    width: 12,
    height: 2,
  },
  legendText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
});