import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface TextInputProps extends RNTextInputProps {
  label: string;
  error?: string;
  containerStyle?: any;
  showPasswordToggle?: boolean;
}

export function TextInput({ 
  label, 
  error, 
  containerStyle,
  showPasswordToggle = false,
  secureTextEntry,
  ...rest 
}: TextInputProps) {
  const { isDarkMode } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  // Determine input state styles
  const getBorderColor = () => {
    if (error) return theme.error;
    if (isFocused) return theme.primary;
    return theme.border;
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[
        styles.label, 
        { color: theme.text.secondary }
      ]}>
        {label}
      </Text>
      
      <View style={styles.inputContainer}>
        <RNTextInput
          style={[
            styles.input,
            { 
              color: theme.text.primary,
              borderColor: getBorderColor(),
              backgroundColor: isDarkMode ? theme.surfaceVariant : theme.surface,
            }
          ]}
          placeholderTextColor={theme.text.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={showPasswordToggle ? !passwordVisible : secureTextEntry}
          {...rest}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity 
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
          >
            {passwordVisible ? (
  <Ionicons name="eye-off-outline" size={20} color={theme.text.secondary} />
            ) : (
              <Ionicons name="eye-outline" size={20} color={theme.text.secondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  passwordToggle: {
    position: 'absolute',
    right: SPACING.md,
    height: '100%',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
});