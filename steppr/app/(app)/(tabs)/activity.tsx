import { useState, useCallback } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme-context";
import { ActivityCard } from "@/components/ActivityCard";
import { FilterChip } from "@/components/FilterChip";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

// Mock data - would be replaced with real data from Firestore
const mockActivities = [
  { id: '1', type: 'walking', steps: 8500, date: new Date() },
  { id: '2', type: 'running', steps: 4200, date: new Date(Date.now() - 86400000) },
  { id: '3', type: 'cycling', steps: 3800, date: new Date(Date.now() - 172800000) },
  { id: '4', type: 'swimming', steps: 2500, date: new Date(Date.now() - 259200000) },
  { id: '5', type: 'yoga', steps: 1200, date: new Date(Date.now() - 345600000) },
  { id: '6', type: 'walking', steps: 7800, date: new Date(Date.now() - 432000000) },
  { id: '7', type: 'running', steps: 5100, date: new Date(Date.now() - 518400000) },
];

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
  const [activities, setActivities] = useState(mockActivities);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredActivities = selectedFilter === 'all'
    ? activities
    : activities.filter(activity => activity.type === selectedFilter);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleFilterChange = (filterId: string) => {
    Haptics.selectionAsync();
    setSelectedFilter(filterId);
  };

  const handleAddActivity = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        No activities found. Tap the + button to add one!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      {renderHeader()}
      {renderFilters()}
      
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard activity={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
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