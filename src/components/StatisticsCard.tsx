import { useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import {
  useTheme,
  type AppTheme,
} from '../theme';
import { useLanguage } from '../preferences/LanguageContext';

type StatisticsCardProps = {
  activePlantCount: number;
  currentStreak: number;
  thisMonthWateringCount: number;
};

export default function StatisticsCard({
  activePlantCount,
  currentStreak,
  thisMonthWateringCount,
}: StatisticsCardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>
          {t('home.statisticsActivePlants')}
        </Text>

        <Text style={styles.value}>
          {activePlantCount}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>
          {t('home.statisticsStreak')}
        </Text>

        <Text style={styles.value}>
          {currentStreak === 1
            ? t('home.statisticsStreakValueOne')
            : t('home.statisticsStreakValue', {
                count: currentStreak,
              })}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>
          {t('home.statisticsMonthlyWatering')}
        </Text>

        <Text style={styles.value}>
          {thisMonthWateringCount === 1
            ? t(
                'home.statisticsMonthlyWateringValueOne',
              )
            : t(
                'home.statisticsMonthlyWateringValue',
                {
                  count:
                    thisMonthWateringCount,
                },
              )}
        </Text>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    spacing,
    radius,
    fontSize,
    fontWeight,
  } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.xl,
      marginTop: spacing.lg,
      padding: spacing.xl,
    },

    row: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    divider: {
      backgroundColor: colors.divider,
      height: 1,
      marginVertical: spacing.lg,
    },

    label: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
    },

    value: {
      color: colors.textPrimary,
      fontSize: fontSize.cardTitle,
      fontWeight: fontWeight.extraBold,
    },
  });
}
