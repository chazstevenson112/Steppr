import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "expo-router";
import { ChevronRight, Moon, Bell, Settings, LogOut, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, signOut } = useAuth();
  const { dailyStepGoal, updateDailyStepGoal } = useUserStore();
  
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
      // In a real app, you would upload this to storage and update the user profile
    }
  };

  const handleEditProfile = () => {
    router.push("/(app)/edit-profile");
  };

  const handleSignOut = async () => {
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available
      }
    }
    await signOut();
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Profile</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handlePickImage} style={styles.profileImageWrapper}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.colors.border }]}>
                  <Text style={[styles.profileImagePlaceholderText, { color: theme.colors.textSecondary }]}>
                    {user?.displayName?.charAt(0) || "U"}
                  </Text>
                </View>
              )}
              <View style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}>
                <Camera size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.profileName, { color: theme.colors.textPrimary }]}>
            {user?.displayName || "User"}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
            {user?.email || "user@example.com"}
          </Text>
          
          <TouchableOpacity
            style={[styles.editButton, { borderColor: theme.colors.border }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.editButtonText, { color: theme.colors.textPrimary }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Preferences
          </Text>
          
          <View style={[styles.settingsCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Moon size={20} color={theme.colors.textPrimary} />
                <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={theme.colors.textPrimary} />
                <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                  Notifications
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Settings size={20} color={theme.colors.textPrimary} />
                <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
                  Settings
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: theme.colors.border }]}
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
  },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImagePlaceholderText: {
    fontSize: 36,
    fontFamily: "Inter-SemiBold",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 16,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#EF4444",
  },
});