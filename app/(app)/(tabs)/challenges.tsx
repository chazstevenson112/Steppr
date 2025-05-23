import { useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { ChallengeCard } from "@/components/ChallengeCard";
import { FilterChip } from "@/components/FilterChip";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";

export default function ChallengesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('active');

  const {
    data: challengesData,
    isLoading,
    refetch,
    isRefetching,
  } = trpc.challenges.list.useQuery(
    {
      userId: user?.uid || '',
      status: selectedFilter as any,
    },
    {
      enabled: !!user?.uid,
    }
  );

  const onRefresh = () => {
    refetch();
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

  const challenges = challengesData?.challenges || [];

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
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChallengeCard 
            challenge={{
              ...item,
              startDate: new Date(item.startDate),
              endDate: new Date(item.endDate),
            }}
            onPress={() => handleChallengePress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              {isLoading ? "Loading challenges..." : "No challenges found. Tap the + button to create one!"}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
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