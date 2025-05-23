import { useState, useCallback } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { ActivityCard } from "@/components/ActivityCard";
import { FilterChip } from "@/components/FilterChip";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'walking', label: 'Walking' },
  { id: 'running', label: 'Running' },
  { id: 'cycling', label: 'Cycling' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'yoga', label: 'Yoga' },
];

export default function ActivityScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const {
    data: activitiesData,
    isLoading,
    refetch,
    isRefetching,
  } = trpc.activities.list.useQuery(
    {
      userId: user?.uid || '',
      type: selectedFilter === 'all' ? undefined : selectedFilter as any,
    },
    {
      enabled: !!user?.uid,
    }
  );

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

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

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Activity Log</Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddActivity}
      >
        <Plus size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filterOptions.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            selected={selectedFilter === filter.id}
            onPress={() => handleFilterChange(filter.id)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
        {isLoading ? "Loading activities..." : "No activities found. Tap the + button to add one!"}
      </Text>
    </View>
  );

  const activities = activitiesData?.activities || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      {renderHeader()}
      {renderFilters()}
      
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard 
            activity={{
              id: item.id,
              type: item.type,
              steps: item.steps,
              date: new Date(item.date),
            }} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
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
    height: 12,
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