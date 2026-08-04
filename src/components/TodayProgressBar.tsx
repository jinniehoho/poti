import { StyleSheet, View } from 'react-native';

import { useTheme } from '../theme';
import TablerIcon from './TablerIcon';

type TodayProgressBarProps = {
  completed: number;
  total: number;
};

export default function TodayProgressBar({
  completed,
  total,
}: TodayProgressBarProps) {
  const safeTotal = Math.max(total, 1);
  const { theme } = useTheme();
  const completedCount = Math.min(
    Math.max(completed, 0),
    safeTotal,
  );
  const gap = safeTotal > 10 ? 2 : 5;
  const iconSize = Math.max(
    5,
    Math.min(
      20,
      Math.floor(
        (260 - gap * (safeTotal - 1)) /
          safeTotal,
      ),
    ),
  );

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        max: safeTotal,
        min: 0,
        now: completedCount,
      }}
      style={[styles.container, { gap }]}
    >
      {Array.from({ length: safeTotal }, (_, index) => {
        const isComplete = index < completedCount;

        return (
          <View key={index} style={styles.iconSlot}>
            <TablerIcon
              color={theme.colors.primary}
              fillColor={
                isComplete
                  ? theme.colors.primary
                  : 'none'
              }
              name="plantPot"
              size={iconSize}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    width: '100%',
  },
  iconSlot: {
    alignItems: 'center',
    flexShrink: 1,
    justifyContent: 'center',
  },
});
