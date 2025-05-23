import { useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme-context";
import { ChallengeCard } from "@/components/ChallengeCard";
import { FilterChip } from "@/components/FilterChip";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";

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
  },
];

export default function ChallengesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [challenges, setChallenges] = useState(mockChallenges);
  const [selectedFilter, setSelectedFilter] = useState('active');
  const [refreshing, setRefreshing] = useState(false);

  const filteredChallenges = selectedFilter === 'all'
    ? challenges
    : challenges.filter(challenge => challenge.status === selectedFilter);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleFilterChange = (filterId: string) => {
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.selectionAsync();
      } catch (error) {
        // Haptics not available
      }
    }
    setSelectedFilter(filterId);
  };

  const handleCreateChallenge = () => {
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available
      }
    }
    router.push("/(app)/create-challenge");
  };

  const handleChallengePress = (challengeId: string) => {
    router.push(`/(app)/challenge/${challengeId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Challenges</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateChallenge}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filters}>
          <FilterChip
            label="Active"
            selected={selectedFilter === 'active'}
            onPress={() => handleFilterChange('active')}
          />
          <FilterChip
            label="Completed"
            selected={selectedFilter === 'completed'}
            onPress={() => handleFilterChange('completed')}
          />
          <FilterChip
            label="All"
            selected={selectedFilter === 'all'}
            onPress={() => handleFilterChange('all')}
          />
        </View>
      </View>
      
      <FlatList
        data={filteredChallenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChallengeCard 
            challenge={item} 
            onPress={() => handleChallengePress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No challenges found. Tap the + button to create one!
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filters: {
    flexDirection: "row",
    paddingVertical: 8,
    gap: 8,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  separator: {
    height: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});