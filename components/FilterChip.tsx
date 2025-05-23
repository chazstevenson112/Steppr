import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/theme-context";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: selected ? theme.colors.primary : "transparent",
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        }
      ]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.label,
          { color: selected ? "#FFFFFF" : theme.colors.textSecondary }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
});