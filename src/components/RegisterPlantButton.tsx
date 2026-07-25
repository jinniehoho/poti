import { Pressable, StyleSheet, Text } from 'react-native';

type RegisterPlantButtonProps = {
  disabled: boolean;
  onPress: () => void;
};

export default function RegisterPlantButton({
  disabled,
  onPress,
}: RegisterPlantButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="식물 등록하기"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled,
        ]}
      >
        식물 등록하기
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#355E3B',
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 17,
  },

  buttonDisabled: {
    backgroundColor: '#D3D7CF',
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  buttonTextDisabled: {
    color: '#92988E',
  },
});