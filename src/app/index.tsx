import {
  router,
  type Href,
} from 'expo-router';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '../components/BrandHeader';
import BottomNavigation, {
  BOTTOM_NAVIGATION_HEIGHT,
} from '../components/BottomNavigation';
import FeedbackBar from '../components/FeedbackBar';
import HomeFeatureTour, {
  type FeatureTourLayout,
  type FeatureTourTarget,
} from '../components/HomeFeatureTour';
import OrganicBackground from '../components/OrganicBackground';
import PlantGrid from '../components/PlantGrid';
import SwipeTabNavigation from '../components/SwipeTabNavigation';
import TodayCard from '../components/TodayCard';
import { usePlants } from '../context/PlantContext';
import { useWatering } from '../hooks/useWatering';
import { useLanguage } from '../preferences/LanguageContext';
import { useOnboarding } from '../onboarding/OnboardingContext';
import { useProfile } from '../profile/ProfileContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';

const BRAND_NAME = 'Poti';

export default function HomeScreen() {
  const {
    plants,
    isLoadingPlants,
    plantsError,
  } = usePlants();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { onboardingCompleted } = useOnboarding();
  const { nickname } = useProfile();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const todayCardRef = useRef<View>(null);
  const addPlantRef = useRef<View>(null);
  const [todayContentY, setTodayContentY] =
    useState(0);
  const [plantsContentY, setPlantsContentY] =
    useState(0);

  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  const {
    waterPlant,
    undoWatering,
    message,
    lastWateredPlant,
    isWatering,
    completionPlant,
    completionKey,
    didCompleteCare,
  } = useWatering();

  const [todayTaskTotal, setTodayTaskTotal] =
    useState(0);

  const duePlants = plants.filter(
    (plant) =>
      plant.status === 'due_today' ||
      plant.status === 'overdue',
  );

  const completionPlantIsStillDue =
    completionPlant
      ? duePlants.some(
          (plant) =>
            plant.id === completionPlant.id,
        )
      : false;
  const displayedDueCount =
    duePlants.length +
    (completionPlant &&
    !completionPlantIsStillDue
      ? 1
      : 0);

  useEffect(() => {
    if (displayedDueCount > todayTaskTotal) {
      setTodayTaskTotal(displayedDueCount);
    }

    if (
      displayedDueCount === 0 &&
      !completionPlant
    ) {
      setTodayTaskTotal(0);
    }
  }, [
    completionPlant,
    displayedDueCount,
    todayTaskTotal,
  ]);

  const featuredPlant =
    completionPlant ?? duePlants[0];

  const currentTaskNumber =
    featuredPlant && todayTaskTotal > 0
      ? todayTaskTotal - displayedDueCount + 1
      : 0;

  const handleAddPlant = () => {
    router.push('/add-plant');
  };

  const handleOpenSettings = () => {
    router.push('/settings' as Href);
  };

  const measureTarget = useCallback(
    async (
      target: FeatureTourTarget,
    ): Promise<FeatureTourLayout | null> => {
      const isPlantsTarget = target === 'plants';
      const scrollY = isPlantsTarget
        ? plantsContentY
        : todayContentY;

      scrollViewRef.current?.scrollTo({
        animated: true,
        y: Math.max(
          0,
          scrollY - theme.spacing.xl,
        ),
      });

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 380);
      });

      const requestedRef =
        target === 'today'
          ? todayCardRef
          : addPlantRef;

      return new Promise((resolve) => {
        requestedRef.current?.measureInWindow(
          (x, y, width, height) => {
            resolve({
              x,
              y,
              width,
              height,
            });
          },
        );

        if (!requestedRef.current) {
          resolve(null);
        }
      });
    },
    [
      plantsContentY,
      theme.spacing.xl,
      todayContentY,
    ],
  );

  return (
    <SwipeTabNavigation
      activeTab="home"
      style={styles.root}
    >
      <OrganicBackground variant="home" />
      <ScrollView
        ref={scrollViewRef}
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              BOTTOM_NAVIGATION_HEIGHT +
              Math.max(
                insets.bottom,
                theme.spacing.sm,
              ) +
              theme.spacing.xl,
            paddingTop: Math.max(
              theme.spacing.screenTop,
              insets.top + theme.spacing.sm,
            ),
          },
        ]}
        scrollEnabled={onboardingCompleted}
        showsVerticalScrollIndicator={false}
      >
        <BrandHeader
          brandName={BRAND_NAME}
          compactBottomSpacing
          nickname={nickname}
          onOpenSettings={handleOpenSettings}
        />

        {isLoadingPlants ? (
          <Text style={styles.plantsMessage}>
            {t('home.plantsLoading')}
          </Text>
        ) : plantsError ? (
          <Text style={styles.plantsError}>
            {plantsError}
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>
          {t('home.todayCare')}
        </Text>

        <View
          ref={todayCardRef}
          collapsable={false}
          onLayout={(event) => {
            setTodayContentY(
              event.nativeEvent.layout.y,
            );
          }}
        >
          <TodayCard
            plant={featuredPlant}
            currentTaskNumber={currentTaskNumber}
            totalTaskCount={todayTaskTotal}
            onWater={waterPlant}
            isWatering={isWatering}
            isCompleted={completionPlant !== null}
            completionKey={completionKey}
            showCompletedEmpty={
              didCompleteCare &&
              displayedDueCount === 0
            }
          />
        </View>

        {message && (
          <FeedbackBar
            message={message}
            showUndo={lastWateredPlant !== null}
            onUndo={undoWatering}
          />
        )}

        <View
          collapsable={false}
          onLayout={(event) => {
            setPlantsContentY(
              event.nativeEvent.layout.y,
            );
          }}
        >
          <PlantGrid
            plants={plants}
            onAddPlant={handleAddPlant}
            addPlantRef={addPlantRef}
          />
        </View>
      </ScrollView>

      <BottomNavigation activeTab="home" />

      <HomeFeatureTour
        measureTarget={measureTarget}
      />
    </SwipeTabNavigation>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontSize,
    fontWeight,
    layout,
    radius,
    spacing,
  } = theme;

  return StyleSheet.create({
    root: {
      backgroundColor: colors.background,
      flex: 1,
    },
    screen: {
      flex: 1,
      backgroundColor: colors.transparent,
    },

    content: {
      width: '100%',
      maxWidth: layout.contentMaxWidth,
      alignSelf: 'center',
      paddingHorizontal: spacing.screenHorizontal,
    },

    plantsMessage: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      marginTop: spacing.lg,
      textAlign: 'center',
    },

    plantsError: {
      backgroundColor: colors.dangerSoft,
      borderRadius: radius.lg,
      color: colors.danger,
      fontSize: fontSize.bodySmall,
      lineHeight: 20,
      marginTop: spacing.lg,
      padding: spacing.lg,
      textAlign: 'center',
    },

    sectionTitle: {
      color: colors.textPrimary,
      fontSize: fontSize.sectionTitle,
      fontWeight: fontWeight.extraBold,
      marginTop: spacing.sm,
    },
  });
}
