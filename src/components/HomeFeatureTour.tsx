import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import {
  ONBOARDING_COPY,
  ONBOARDING_STEPS,
} from '../onboarding/content';
import { useOnboarding } from '../onboarding/OnboardingContext';
import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import {
  BOTTOM_NAVIGATION_HEIGHT,
} from './BottomNavigation';

export type FeatureTourTarget =
  (typeof ONBOARDING_STEPS)[number]['target'];

export type FeatureTourLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type HomeFeatureTourProps = {
  measureTarget: (
    target: FeatureTourTarget,
  ) => Promise<FeatureTourLayout | null>;
};

const SPOTLIGHT_PADDING = 8;
const SCREEN_EDGE_GAP = 6;
const CONTENT_FADE_DURATION = 180;

function getRoundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const right = x + width;
  const bottom = y + height;
  const safeRadius = Math.min(
    radius,
    width / 2,
    height / 2,
  );

  return [
    `M ${x + safeRadius} ${y}`,
    `H ${right - safeRadius}`,
    `Q ${right} ${y} ${right} ${y + safeRadius}`,
    `V ${bottom - safeRadius}`,
    `Q ${right} ${bottom} ${right - safeRadius} ${bottom}`,
    `H ${x + safeRadius}`,
    `Q ${x} ${bottom} ${x} ${bottom - safeRadius}`,
    `V ${y + safeRadius}`,
    `Q ${x} ${y} ${x + safeRadius} ${y}`,
    'Z',
  ].join(' ');
}

export default function HomeFeatureTour({
  measureTarget,
}: HomeFeatureTourProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const {
    onboardingCompleted,
    completeOnboarding,
  } = useOnboarding();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const contentOpacity = useRef(
    new Animated.Value(0),
  ).current;
  const [stepIndex, setStepIndex] = useState(0);
  const [targetLayout, setTargetLayout] =
    useState<FeatureTourLayout | null>(null);
  const [isCompleting, setIsCompleting] =
    useState(false);
  const [isTransitioning, setIsTransitioning] =
    useState(true);

  const step = ONBOARDING_STEPS[stepIndex];
  const stepTitle = t(step.titleKey);
  const stepDescription = t(step.descriptionKey);

  useEffect(() => {
    if (onboardingCompleted) return;

    let isActive = true;
    setTargetLayout(null);
    contentOpacity.setValue(0);
    setIsTransitioning(true);

    void measureTarget(step.target).then(
      (layout) => {
        if (isActive) {
          setTargetLayout(layout);
          Animated.timing(contentOpacity, {
            duration: CONTENT_FADE_DURATION,
            toValue: 1,
            useNativeDriver: true,
          }).start(() => {
            if (isActive) {
              setIsTransitioning(false);
            }
          });
        }
      },
    );

    return () => {
      isActive = false;
    };
  }, [
    measureTarget,
    onboardingCompleted,
    step.target,
    contentOpacity,
    height,
    insets.bottom,
    insets.top,
    width,
  ]);

  if (onboardingCompleted) {
    return null;
  }

  const finish = async () => {
    if (isCompleting) return;

    try {
      setIsCompleting(true);
      await completeOnboarding();
    } finally {
      setIsCompleting(false);
    }
  };

  const next = () => {
    if (isTransitioning) return;

    if (
      stepIndex ===
      ONBOARDING_STEPS.length - 1
    ) {
      void finish();
      return;
    }

    setIsTransitioning(true);
    Animated.timing(contentOpacity, {
      duration: CONTENT_FADE_DURATION,
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setStepIndex((current) => current + 1);
      }
    });
  };

  const navigationBottomInset = Math.max(
    insets.bottom,
    theme.spacing.xs,
  );
  const safeContentBottom = Math.max(
    insets.top + theme.spacing.xxxl,
    height -
      navigationBottomInset -
      BOTTOM_NAVIGATION_HEIGHT -
      theme.spacing.md,
  );
  const spotlight = targetLayout
    ? (() => {
        const left = Math.max(
          SCREEN_EDGE_GAP,
          targetLayout.x - SPOTLIGHT_PADDING,
        );
        const right = Math.min(
          width - SCREEN_EDGE_GAP,
          targetLayout.x +
            targetLayout.width +
            SPOTLIGHT_PADDING,
        );
        const top = Math.max(
          insets.top + SCREEN_EDGE_GAP,
          targetLayout.y - SPOTLIGHT_PADDING,
        );
        const bottom = Math.min(
          safeContentBottom,
          targetLayout.y +
            targetLayout.height +
            SPOTLIGHT_PADDING,
        );

        return {
          x: left,
          y: top,
          width: Math.max(1, right - left),
          height: Math.max(1, bottom - top),
          radius:
            step.target === 'plants'
              ? Math.max(1, (bottom - top) / 2)
              : theme.radius.largeCard +
                SPOTLIGHT_PADDING,
        };
      })()
    : null;
  const guideCardBottom =
    navigationBottomInset +
    BOTTOM_NAVIGATION_HEIGHT +
    theme.spacing.md;
  const overlayPath = spotlight
    ? [
        `M 0 0 H ${width} V ${height} H 0 Z`,
        getRoundedRectPath(
          spotlight.x,
          spotlight.y,
          spotlight.width,
          spotlight.height,
          spotlight.radius,
        ),
      ].join(' ')
    : `M 0 0 H ${width} V ${height} H 0 Z`;

  return (
    <View
      accessibilityViewIsModal
      style={StyleSheet.absoluteFill}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${stepIndex + 1}/${ONBOARDING_STEPS.length} ${stepTitle}`}
        onPress={next}
        style={StyleSheet.absoluteFill}
      >
        <Svg
          height={height}
          pointerEvents="none"
          width={width}
        >
          <Path
            d={overlayPath}
            fill={theme.colors.overlay}
            fillRule="evenodd"
          />
          {spotlight ? (
            <Rect
              fill="none"
              height={spotlight.height}
              opacity={0.82}
              rx={spotlight.radius}
              ry={spotlight.radius}
              stroke={theme.colors.primary}
              strokeDasharray="5 5"
              strokeWidth={1.5}
              width={spotlight.width}
              x={spotlight.x}
              y={spotlight.y}
            />
          ) : null}
        </Svg>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={isCompleting}
        hitSlop={10}
        onPress={() => {
          void finish();
        }}
        style={[
          styles.skipButton,
          {
            top: insets.top + 10,
          },
        ]}
      >
        <Text style={styles.skipText}>
          {t(ONBOARDING_COPY.skip)}
        </Text>
      </Pressable>

      <Animated.View
        pointerEvents={
          targetLayout ? 'auto' : 'none'
        }
        style={[
          styles.guideCard,
          {
            bottom: guideCardBottom,
            opacity: contentOpacity,
          },
        ]}
      >
        <Text style={styles.stepText}>
          {stepIndex + 1}/{ONBOARDING_STEPS.length}
        </Text>
        <Text style={styles.title}>
          {stepTitle}
        </Text>
        <Text style={styles.description}>
          {stepDescription}
        </Text>

        <Pressable
          accessibilityRole="button"
          disabled={
            isCompleting || isTransitioning
          }
          onPress={next}
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {stepIndex ===
            ONBOARDING_STEPS.length - 1
              ? t(ONBOARDING_COPY.start)
              : t(ONBOARDING_COPY.next)}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontSize,
    fontWeight,
    radius,
    spacing,
  } = theme;

  return StyleSheet.create({
    skipButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.pill,
      minHeight: 40,
      paddingHorizontal: spacing.lg,
      position: 'absolute',
      right: spacing.screenHorizontal,
      justifyContent: 'center',
    },
    skipText: {
      color: colors.textPrimary,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
    },
    guideCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.largeCard,
      borderWidth: 1,
      left: spacing.screenHorizontal,
      padding: spacing.xl,
      position: 'absolute',
      right: spacing.screenHorizontal,
    },
    stepText: {
      color: colors.primary,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.extraBold,
    },
    title: {
      color: colors.textPrimary,
      fontSize: fontSize.cardTitle,
      fontWeight: fontWeight.extraBold,
      marginTop: spacing.sm,
    },
    description: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 21,
      marginTop: spacing.sm,
    },
    nextButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      justifyContent: 'center',
      marginTop: spacing.lg,
      minHeight: 48,
    },
    nextButtonText: {
      color: colors.textInverse,
      fontSize: fontSize.body,
      fontWeight: fontWeight.extraBold,
    },
    pressed: {
      opacity: 0.72,
    },
  });
}
