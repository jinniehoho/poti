import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontSize,
  radius,
  spacing,
} from '../constants/theme';

type FeedbackBarProps = {
  message: string;
  showUndo: boolean;
  onUndo: () => void;
};

export default function FeedbackBar({
  message,
  showUndo,
  onUndo,
}: FeedbackBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>

      {showUndo && (
        <Pressable onPress={onUndo}>
          <Text style={styles.undoText}>실행 취소</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.textPrimary,
    borderRadius: radius.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  message: {
    flex: 1,
    color: colors.white,
    fontSize: fontSize.bodySmall,
    fontWeight: '600',
  },

  undoText: {
    color: colors.statusToday,
    fontSize: fontSize.bodySmall,
    fontWeight: '800',
    marginLeft: spacing.lg,
  },
});