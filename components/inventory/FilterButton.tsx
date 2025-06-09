// components/FilterButton.tsx
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type FilterButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeBgColor: string;
  inactiveBgColor: string;
  activeTextColor: string;
  inactiveTextColor: string;
};

export const FilterButton = ({
  label,
  isActive,
  onPress,
  activeBgColor,
  inactiveBgColor,
  activeTextColor,
  inactiveTextColor,
}: FilterButtonProps) => (
  <TouchableOpacity
    style={[
      styles.button,
      { backgroundColor: isActive ? activeBgColor : inactiveBgColor }
    ]}
    onPress={onPress}
  >
    <Text style={{ color: isActive ? activeTextColor : inactiveTextColor }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
});