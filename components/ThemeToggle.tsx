import { BORDER_RADIUS, COLORS } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  // Handle theme toggle with animation
  const handleToggle = () => {
    // Scale animation
    scale.value = withSequence(
      withTiming(0.8, { duration: 150, easing: Easing.inOut(Easing.ease) }),
      withTiming(1.1, { duration: 200, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) })
    );

    // Rotation animation
    rotation.value = withDelay(
      100,
      withTiming(rotation.value + 180, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      })
    );

    toggleTheme();
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: isDarkMode
        ? COLORS.dark.surfaceVariant
        : COLORS.light.surfaceVariant,
    },
  };

  return (
    <TouchableOpacity
      style={[styles.container, dynamicStyles.container]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {isDarkMode ? (
          <Ionicons
            name="sunny-outline"
            size={20}
            color={COLORS.dark.text.primary}
          />
        ) : (
          <Ionicons
            name="moon-outline"
            size={20}
            color={COLORS.light.text.primary}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
