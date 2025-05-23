import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Steppr",
  slug: "steppr-fitness-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.steppr.fitnessapp"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.steppr.fitnessapp"
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/images/splash.png",
        dark: {
          image: "./assets/images/splash.png",
          backgroundColor: "#000000"
        },
        imageWidth: 200
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    // Firebase configuration would go here in a real app
    // These would be resolved from environment variables
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
    eas: {
      projectId: "your-eas-project-id"
    }
  }
});