import { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { ArrowLeft, Calendar, Users } from "lucide-react-native";

export default function CreateChallengeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [name, setName] = useState("");
  const [targetSteps, setTargetSteps] = useState("10000");
  const [duration, setDuration] = useState("7");
  const [isDailyAverage, setIsDailyAverage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleCreateChallenge = async () => {
    if (!name || !targetSteps || !duration) {
      alert("Please fill in all fields");
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
      // In a real app, this would create a challenge in Firestore
      setTimeout(() => {
        router.replace("/(app)/(tabs)/challenges");
      }, 1000);
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Failed to create challenge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Create Challenge
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Challenge Name
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Enter challenge name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Target Steps
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Enter target steps"
            placeholderTextColor={theme.colors.textSecondary}
            value={targetSteps}
            onChangeText={setTargetSteps}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Duration (days)
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Enter duration in days"
            placeholderTextColor={theme.colors.textSecondary}
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Text style={[styles.switchText, { color: theme.colors.textPrimary }]}>
              Daily Average Goal
            </Text>
            <Text style={[styles.switchDescription, { color: theme.colors.textSecondary }]}>
              If enabled, the target is a daily average instead of a total
            </Text>
          </View>
          <Switch
            value={isDailyAverage}
            onValueChange={setIsDailyAverage}
            trackColor={{ false: "#767577", true: theme.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoHeader}>
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
              Challenge Details
            </Text>
          </View>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            {isDailyAverage 
              ? `Participants will aim to average ${parseInt(targetSteps).toLocaleString()} steps per day over ${duration} days.`
              : `Participants will aim to reach a total of ${(parseInt(targetSteps) * parseInt(duration)).toLocaleString()} steps over ${duration} days.`
            }
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.infoHeader}>
            <Users size={20} color={theme.colors.primary} />
            <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
              Invite Participants
            </Text>
          </View>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            After creating the challenge, you'll be able to invite friends via a unique code or QR code.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.disabledButton
          ]}
          onPress={handleCreateChallenge}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? "Creating..." : "Create Challenge"}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
  content: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    lineHeight: 20,
  },
  createButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: Platform.OS === "ios" ? 40 : 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#FFFFFF",
  },
});