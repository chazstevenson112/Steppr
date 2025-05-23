import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { useHealthPermissions } from "@/hooks/use-health-permissions";

export default function PermissionsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { requestPermissions, permissionsGranted } = useHealthPermissions();
  const [loading, setLoading] = useState(false);

  const handleRequestPermissions = async () => {
    setLoading(true);
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available
      }
    }
    
    try {
      await requestPermissions();
      router.replace("/(app)/(tabs)");
    } catch (error) {
      console.error("Error requesting permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace("/(app)/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1000" }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Connect Your Health Data
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {Platform.OS === "ios" 
              ? "Allow Steppr to access Apple Health to automatically track your steps and activities."
              : "Allow Steppr to access Google Fit to automatically track your steps and activities."}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleRequestPermissions}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Requesting Access..." : "Connect Health Data"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSkip}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.textSecondary }]}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  imageContainer: {
    height: 300,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  secondaryButton: {
    // No background
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
});