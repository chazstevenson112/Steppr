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
    bundleIdentifier: "com.steppr.fitnessapp",
    infoPlist: {
      NSHealthShareUsageDescription: "This app needs access to your health data to track your steps and activities.",
      NSHealthUpdateUsageDescription: "This app needs access to update your health data with activities you log."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.steppr.fitnessapp",
    permissions: [
      "android.permission.ACTIVITY_RECOGNITION",
      "android.permission.BODY_SENSORS"
    ]
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
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemo_Replace_With_Real_Key",
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "steppr-demo.firebaseapp.com",
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "steppr-demo",
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "steppr-demo.appspot.com",
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
    trpcBaseUrl: process.env.EXPO_PUBLIC_TRPC_BASE_URL || "http://localhost:3000",
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || "your-eas-project-id"
    }
  }
});