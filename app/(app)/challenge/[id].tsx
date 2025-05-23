import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { ArrowLeft, Share2 } from "lucide-react-native";

// Mock data - would be replaced with real data from Firestore
const mockChallenges = [
  {
    id: '1',
    name: 'Weekend Warrior',
    type: 'total_steps_goal' as const,
    targetSteps: 25000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 172800000), // 2 days from now
    participants: [
      { id: 'user1', name: 'You', steps: 8500, photoURL: null },
      { id: 'user2', name: 'Sarah', steps: 12000, photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
      { id: 'user3', name: 'Mike', steps: 6300, photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100' },
    ],
    status: 'active' as const,
    inviteCode: 'WEEKEND123',
  },
  {
    id: '2',
    name: 'Monthly Challenge',
    type: 'daily_average_goal' as const,
    targetSteps: 10000,
    startDate: new Date(Date.now() - 1209600000), // 14 days ago
    endDate: new Date(Date.now() + 1209600000), // 14 days from now
    participants: [
      { id: 'user1', name: 'You', steps: 98000, photoURL: null },
      { id: 'user2', name: 'Sarah', steps: 112000, photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
      { id: 'user3', name: 'Mike', steps: 86000, photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100' },
      { id: 'user4', name: 'Emma', steps: 105000, photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100' },
    ],
    status: 'active' as const,
    inviteCode: 'MONTHLY456',
  },
  {
    id: '3',
    name: 'Spring Challenge',
    type: 'total_steps_goal' as const,
    targetSteps: 100000,
    startDate: new Date(Date.now() - 2592000000), // 30 days ago
    endDate: new Date(Date.now() - 864000000), // 10 days ago
    participants: [
      { id: 'user1', name: 'You', steps: 92000, photoURL: null },
      { id: 'user2', name: 'Sarah', steps: 88000, photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
      { id: 'user3', name: 'Mike', steps: 105000, photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100' },
    ],
    status: 'completed' as const,
    inviteCode: 'SPRING789',
  },
];

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the challenge from Firestore
    const foundChallenge = mockChallenges.find(c => c.id === id);
    setChallenge(foundChallenge);
    setLoading(false);
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available
      }
    }
    // In a real app, this would generate a dynamic link and share it
    alert(`Share invite code: ${challenge?.inviteCode}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!challenge) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <ArrowLeft size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: theme.colors.textPrimary }]}>
            Challenge not found
          </Text>
          <TouchableOpacity onPress={handleBack}>
            <Text style={[styles.backLink, { color: theme.colors.primary }]}>
              Go back to challenges
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isActive = challenge.status === 'active';
  const sortedParticipants = [...challenge.participants].sort((a, b) => b.steps - a.steps);
  const totalDays = Math.ceil((challenge.endDate.getTime() - challenge.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = isActive 
    ? Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  const progress = isActive 
    ? Math.min(1, (totalDays - daysLeft) / totalDays)
    : 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        {isActive && (
          <TouchableOpacity onPress={handleShare}>
            <Share2 size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.challengeHeader}>
          <Text style={[styles.challengeName, { color: theme.colors.textPrimary }]}>
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

        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Goal
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {challenge.targetSteps.toLocaleString()} steps
              </Text>
              <Text style={[styles.infoSubtext, { color: theme.colors.textSecondary }]}>
                {challenge.type === 'daily_average_goal' ? 'daily average' : 'total'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Duration
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {totalDays} days
              </Text>
              <Text style={[styles.infoSubtext, { color: theme.colors.textSecondary }]}>
                {isActive ? `${daysLeft} days left` : 'completed'}
              </Text>
            </View>
          </View>

          {isActive && (
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
              <View style={styles.progressLabels}>
                <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                  {new Date(challenge.startDate).toLocaleDateString()}
                </Text>
                <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                  {new Date(challenge.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Leaderboard
          </Text>
          
          <View style={[styles.leaderboardCard, { backgroundColor: theme.colors.card }]}>
            {sortedParticipants.map((participant, index) => {
              const isFirst = index === 0;
              const isYou = participant.name === 'You';
              
              return (
                <View key={participant.id}>
                  {index > 0 && (
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                  )}
                  <View style={[
                    styles.leaderboardItem, 
                    isYou && { backgroundColor: theme.colors.primary + '10' }
                  ]}>
                    <View style={styles.leaderboardLeft}>
                      <Text style={[styles.rank, { color: theme.colors.textSecondary }]}>
                        {index + 1}
                      </Text>
                      {participant.photoURL ? (
                        <Image source={{ uri: participant.photoURL }} style={styles.participantImage} />
                      ) : (
                        <View style={[styles.participantImagePlaceholder, { backgroundColor: theme.colors.border }]}>
                          <Text style={[styles.participantInitial, { color: theme.colors.textSecondary }]}>
                            {participant.name.charAt(0)}
                          </Text>
                        </View>
                      )}
                      <Text style={[
                        styles.participantName, 
                        { color: theme.colors.textPrimary },
                        isYou && { fontFamily: "Inter-SemiBold" }
                      ]}>
                        {participant.name}
                      </Text>
                      {isFirst && (
                        <Text style={styles.crown}>👑</Text>
                      )}
                    </View>
                    <Text style={[styles.steps, { color: theme.colors.textPrimary }]}>
                      {participant.steps.toLocaleString()}
                    </Text>
                  </View>
                </View>
              );
            })}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  challengeName: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 16,
  },
  leaderboardCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  leaderboardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rank: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    width: 24,
    textAlign: "center",
  },
  participantImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  participantImagePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  participantInitial: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  participantName: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  crown: {
    fontSize: 16,
    marginLeft: 4,
  },
  steps: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  divider: {
    height: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
});