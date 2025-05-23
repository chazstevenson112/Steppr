import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/context/theme-context";

interface Participant {
  id: string;
  name: string;
  steps: number;
  photoURL: string | null;
}

interface Challenge {
  id: string;
  name: string;
  type: "total_steps_goal" | "daily_average_goal";
  targetSteps: number;
  startDate: Date;
  endDate: Date;
  participants: Participant[];
  status: "active" | "completed";
}

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onPress }) => {
  const { theme } = useTheme();
  
  const isActive = challenge.status === "active";
  const totalDays = Math.ceil((challenge.endDate.getTime() - challenge.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = isActive 
    ? Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Sort participants by steps
  const sortedParticipants = [...challenge.participants].sort((a, b) => b.steps - a.steps);
  
  // Find the user's position
  const userPosition = sortedParticipants.findIndex(p => p.name === "You") + 1;
  
  // Calculate progress for the progress bar
  const progress = isActive 
    ? Math.min(1, (totalDays - daysLeft) / totalDays)
    : 1;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
          {challenge.name}
        </Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: isActive ? theme.colors.primary + '20' : theme.colors.border }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: isActive ? theme.colors.primary : theme.colors.textSecondary }
          ]}>
            {isActive ? 'Active' : 'Completed'}
          </Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
          {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
        </Text>
        {isActive && (
          <Text style={[styles.daysLeft, { color: theme.colors.textSecondary }]}>
            {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
          </Text>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: theme.colors.primary,
                width: `${progress * 100}%`
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.participantsRow}>
        <View style={styles.avatarList}>
          {sortedParticipants.slice(0, 3).map((participant, index) => (
            <View 
              key={participant.id} 
              style={[
                styles.avatarContainer,
                { 
                  zIndex: 3 - index,
                  marginLeft: index > 0 ? -12 : 0,
                  borderColor: theme.colors.card,
                }
              ]}
            >
              {participant.photoURL ? (
                <Image source={{ uri: participant.photoURL }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
                  <Text style={[styles.avatarInitial, { color: theme.colors.textSecondary }]}>
                    {participant.name.charAt(0)}
                  </Text>
                </View>
              )}
              {index === 0 && (
                <Text style={styles.crown}>👑</Text>
              )}
            </View>
          ))}
          {challenge.participants.length > 3 && (
            <View 
              style={[
                styles.avatarContainer, 
                styles.moreAvatars,
                { 
                  marginLeft: -12,
                  borderColor: theme.colors.card,
                  backgroundColor: theme.colors.border,
                }
              ]}
            >
              <Text style={[styles.moreAvatarsText, { color: theme.colors.textSecondary }]}>
                +{challenge.participants.length - 3}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.userPosition}>
          <Text style={[styles.positionText, { color: theme.colors.textSecondary }]}>
            Your position:
          </Text>
          <Text style={[styles.positionNumber, { color: theme.colors.textPrimary }]}>
            {userPosition}{getOrdinalSuffix(userPosition)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(n: number): string {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  daysLeft: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  participantsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarList: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  crown: {
    position: "absolute",
    top: -10,
    right: -5,
    fontSize: 14,
  },
  moreAvatars: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreAvatarsText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  userPosition: {
    alignItems: "flex-end",
  },
  positionText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  positionNumber: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
});