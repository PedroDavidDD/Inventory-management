import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  onPress, 
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  textStyle
}: ButtonProps) {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  // Determine styles based on variant and theme
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.primary,
          },
          text: {
            color: theme.text.inverse,
          }
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.secondary,
          },
          text: {
            color: theme.text.inverse,
          }
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.primary,
          },
          text: {
            color: theme.primary,
          }
        };
      default:
        return {
          container: {
            backgroundColor: theme.primary,
          },
          text: {
            color: theme.text.inverse,
          }
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        variantStyles.container,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? theme.primary : theme.text.inverse}
        />
      ) : (
        <Text style={[styles.text, variantStyles.text, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});