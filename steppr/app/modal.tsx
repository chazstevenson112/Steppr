import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { X } from "lucide-react-native";

const activityTypes = [
  { id: "walking", name: "Walking", icon: "🚶", unit: "steps", placeholder: "Enter steps" },
  { id: "running", name: "Running", icon: "🏃", unit: "km", placeholder: "Enter distance (km)" },
  { id: "cycling", name: "Cycling", icon: "🚴", unit: "km", placeholder: "Enter distance (km)" },
  { id: "swimming", name: "Swimming", icon: "🏊", unit: "minutes", placeholder: "Enter duration (min)" },
  { id: "yoga", name: "Yoga", icon: "🧘", unit: "minutes", placeholder: "Enter duration (min)" },
  { id: "hiking", name: "Hiking", icon: "🥾", unit: "km", placeholder: "Enter distance (km)" },
  { id: "dancing", name: "Dancing", icon: "💃", unit: "minutes", placeholder: "Enter duration (min)" },
  { id: "weightlifting", name: "Weightlifting", icon: "🏋️", unit: "minutes", placeholder: "Enter duration (min)" },
];

export default function AddActivityModal() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleSelectActivity = (activityId: string) => {
    if (Platform.OS !== 'web') {
      // Only use haptics on native platforms
      try {
        const Haptics = require('expo-haptics');
        Haptics.selectionAsync();
      } catch (error) {
        // Haptics not available
      }
    }
    setSelectedActivity(activityId);
  };

  const handleAddActivity = async () => {
    if (!selectedActivity || !quantity) {
      alert("Please select an activity and enter a value");
      return;
    }

    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available
      }
    }
    
    setLoading(true);

    try {
      // In a real app, this would add the activity to Firestore
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.error("Error adding activity:", error);
      alert("Failed to add activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedActivityDetails = activityTypes.find(a => a.id === selectedActivity);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Add Activity
        </Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Activity Type
        </Text>
        
        <View style={styles.activityGrid}>
          {activityTypes.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityItem,
                { 
                  backgroundColor: selectedActivity === activity.id 
                    ? theme.colors.primary + '20'
                    : theme.colors.card,
                  borderColor: selectedActivity === activity.id 
                    ? theme.colors.primary
                    : theme.colors.border,
                }
              ]}
              onPress={() => handleSelectActivity(activity.id)}
            >
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <Text 
                style={[
                  styles.activityName, 
                  { 
                    color: theme.colors.textPrimary,
                    fontFamily: selectedActivity === activity.id 
                      ? "Inter-SemiBold" 
                      : "Inter-Regular"
                  }
                ]}
              >
                {activity.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedActivity && (
          <View style={styles.quantitySection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {selectedActivityDetails?.name} Details
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.colors.card,
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border
                  }
                ]}
                placeholder={selectedActivityDetails?.placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />
              <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>
                {selectedActivityDetails?.unit}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: theme.colors.primary },
            (!selectedActivity || !quantity || loading) && styles.disabledButton
          ]}
          onPress={handleAddActivity}
          disabled={!selectedActivity || !quantity || loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? "Adding..." : "Add Activity"}
          </Text>
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
  closeButton: {
    position: "absolute",
    right: 20,
  },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 16,
  },
  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  activityItem: {
    width: "47%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
  },
  activityIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  activityName: {
    fontSize: 14,
  },
  quantitySection: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  unitText: {
    position: "absolute",
    right: 16,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  addButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#FFFFFF",
  },
});