import { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { useUserStore } from "@/stores/user-store";
import { ArrowLeft, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const { dailyStepGoal, updateDailyStepGoal } = useUserStore();
  
  const [name, setName] = useState(user?.displayName || "");
  const [stepGoal, setStepGoal] = useState(dailyStepGoal.toString());
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handlePickImage = async () => {
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available
      }
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name) {
      alert("Please enter your name");
      return;
    }

    if (!stepGoal || parseInt(stepGoal) <= 0) {
      alert("Please enter a valid step goal");
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
      // In a real app, this would update the user profile in Firebase
      await updateProfile({ displayName: name });
      updateDailyStepGoal(parseInt(stepGoal));
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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
          Edit Profile
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={handlePickImage} style={styles.profileImageWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.colors.border }]}>
                <Text style={[styles.profileImagePlaceholderText, { color: theme.colors.textSecondary }]}>
                  {name.charAt(0) || "U"}
                </Text>
              </View>
            )}
            <View style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Name
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
            placeholder="Enter your name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Daily Step Goal
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
            placeholder="Enter your daily step goal"
            placeholderTextColor={theme.colors.textSecondary}
            value={stepGoal}
            onChangeText={setStepGoal}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.textSecondary,
                borderColor: theme.colors.border
              }
            ]}
            value={user?.email || ""}
            editable={false}
          />
          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            Email cannot be changed
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.disabledButton
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Changes"}
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
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImagePlaceholderText: {
    fontSize: 48,
    fontFamily: "Inter-SemiBold",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
  helperText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
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
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#FFFFFF",
  },
});