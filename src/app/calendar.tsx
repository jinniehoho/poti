import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomNavigation, {
  BOTTOM_NAVIGATION_HEIGHT,
} from '../components/BottomNavigation';
import BrandHeader from '../components/BrandHeader';
import MonthlyCareCalendar from '../components/MonthlyCareCalendar';
import OrganicBackground from '../components/OrganicBackground';
import SwipeTabNavigation from '../components/SwipeTabNavigation';
import { usePlants } from '../context/PlantContext';
import { useCareCalendar } from '../hooks/useCareCalendar';
import {
  useTheme,
  type AppTheme,
} from '../theme';

const BRAND_NAME = 'Poti';

export default function CalendarScreen() {
  const { plants } = usePlants();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const [displayedMonth, setDisplayedMonth] =
    useState(
      () =>
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1,
        ),
    );
  const displayedYear = displayedMonth.getFullYear();
  const displayedMonthIndex = displayedMonth.getMonth();
  const {
    calendar,
    isLoading,
    error,
  } = useCareCalendar(
    displayedYear,
    displayedMonthIndex,
  );

  const moveMonth = (offset: number) => {
    setDisplayedMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + offset,
          1,
        ),
    );
  };

  const returnToCurrentMonth = () => {
    const now = new Date();
    setDisplayedMonth(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ),
    );
  };

  return (
    <SwipeTabNavigation
      activeTab="calendar"
      style={styles.root}
    >
      <OrganicBackground variant="calendar" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              BOTTOM_NAVIGATION_HEIGHT +
              Math.max(insets.bottom, theme.spacing.sm) +
              theme.spacing.xl,
            paddingTop: Math.max(
              theme.spacing.screenTop,
              insets.top + theme.spacing.sm,
            ),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <BrandHeader
          brandName={BRAND_NAME}
          compactBottomSpacing
          onOpenSettings={() => {
            router.push('/settings' as Href);
          }}
        />
        <MonthlyCareCalendar
          data={{
            ...calendar,
            activePlantCount: plants.length,
          }}
          error={error}
          isLoading={isLoading}
          month={displayedMonthIndex}
          onCurrentMonth={returnToCurrentMonth}
          onNextMonth={() => moveMonth(1)}
          onPreviousMonth={() => moveMonth(-1)}
          plants={plants}
          year={displayedYear}
        />
      </ScrollView>

      <BottomNavigation activeTab="calendar" />
    </SwipeTabNavigation>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, layout, spacing } = theme;

  return StyleSheet.create({
    root: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      alignSelf: 'center',
      maxWidth: layout.contentMaxWidth,
      paddingHorizontal: spacing.md,
      width: '100%',
    },
  });
}
