import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  useMemo,
  useState,
} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import { AppText as Text } from '../theme/Typography';
import TablerIcon from './TablerIcon';

export type BottomNavigationTab =
  | 'calendar'
  | 'home'
  | 'myPlants'
  | 'addPlant'
  | 'profile';

type BottomNavigationProps = {
  activeTab: BottomNavigationTab;
};

export type BottomNavigationTabConfig = {
  key: BottomNavigationTab;
  href:
    | '/'
    | '/calendar'
    | '/my-plants'
    | '/add-plant'
    | '/profile';
  labelKey:
    | 'navigation.calendar'
    | 'navigation.home'
    | 'navigation.myPlants'
    | 'navigation.addPlant'
    | 'navigation.profile';
  isCenter?: boolean;
  isMyPlants?: boolean;
  isProfile?: boolean;
};

const BAR_BODY_TOP = 30;
const BAR_BODY_HEIGHT = 58;
const BAR_CORNER_RADIUS = 24;
const NOTCH_HALF_WIDTH = 52;
const NOTCH_DEPTH = 38;
const HOME_BUTTON_SIZE = 60;

function TablerMyPlantsIcon({
  color,
}: {
  color: string;
}) {
  return (
    <Svg
      fill="none"
      height={21}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={21}
    >
      <Path d="M12 10a6 6 0 0 0 -6 -6h-3v2a6 6 0 0 0 6 6h3" />
      <Path d="M12 14a6 6 0 0 1 6 -6h3v1a6 6 0 0 1 -6 6h-3" />
      <Path d="M12 20l0 -10" />
    </Svg>
  );
}

function TablerCalendarIcon({
  color,
}: {
  color: string;
}) {
  return (
    <Svg
      fill="none"
      height={21}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={21}
    >
      <Path
        d="M0 0h24v24H0z"
        fill="none"
        stroke="none"
      />
      <Path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
      <Path d="M16 3v4" />
      <Path d="M8 3v4" />
      <Path d="M4 11h16" />
      <Path d="M7 14h.013" />
      <Path d="M10.01 14h.005" />
      <Path d="M13.01 14h.005" />
      <Path d="M16.015 14h.005" />
      <Path d="M13.015 17h.005" />
      <Path d="M7.01 17h.005" />
      <Path d="M10.01 17h.005" />
    </Svg>
  );
}

function TablerPlusIcon({
  color,
}: {
  color: string;
}) {
  return (
    <Svg
      fill="none"
      height={21}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={21}
    >
      <Path
        d="M0 0h24v24H0z"
        fill="none"
        stroke="none"
      />
      <Path d="M12 5l0 14" />
      <Path d="M5 12l14 0" />
    </Svg>
  );
}

export const BOTTOM_NAVIGATION_HEIGHT =
  BAR_BODY_TOP + BAR_BODY_HEIGHT;

export const BOTTOM_NAVIGATION_TABS: readonly BottomNavigationTabConfig[] = [
  {
    key: 'calendar',
    href: '/calendar',
    labelKey: 'navigation.calendar',
  },
  {
    key: 'myPlants',
    href: '/my-plants',
    labelKey: 'navigation.myPlants',
    isMyPlants: true,
  },
  {
    key: 'home',
    href: '/',
    labelKey: 'navigation.home',
    isCenter: true,
  },
  {
    key: 'addPlant',
    href: '/add-plant',
    labelKey: 'navigation.addPlant',
  },
  {
    key: 'profile',
    href: '/profile',
    labelKey: 'navigation.profile',
    isProfile: true,
  },
];

export type TabTransitionDirection =
  | 'forward'
  | 'backward';

export function navigateToBottomTab(
  activeTab: BottomNavigationTab,
  targetTab: BottomNavigationTab,
  transitionDirection?: TabTransitionDirection,
) {
  const activeIndex =
    BOTTOM_NAVIGATION_TABS.findIndex(
      (tab) => tab.key === activeTab,
    );
  const targetIndex =
    BOTTOM_NAVIGATION_TABS.findIndex(
      (tab) => tab.key === targetTab,
    );
  const target = BOTTOM_NAVIGATION_TABS[targetIndex];

  if (
    !target ||
    activeIndex < 0 ||
    targetIndex === activeIndex
  ) {
    return;
  }

  router.replace({
    pathname: target.href,
    params: {
      tabDirection:
        transitionDirection ??
        (targetIndex > activeIndex
          ? 'forward'
          : 'backward'),
    },
  });
}

function createTabBarBackground(
  width: number,
  color: string,
) {
  const center = width / 2;
  const top = BAR_BODY_TOP;
  const bottom = BOTTOM_NAVIGATION_HEIGHT;
  const notchBottom = top + NOTCH_DEPTH;
  const path = [
    `M ${BAR_CORNER_RADIUS} ${top}`,
    `H ${center - NOTCH_HALF_WIDTH}`,
    `C ${center - 42} ${top}, ${center - 42} ${notchBottom}, ${center} ${notchBottom}`,
    `C ${center + 42} ${notchBottom}, ${center + 42} ${top}, ${center + NOTCH_HALF_WIDTH} ${top}`,
    `H ${width - BAR_CORNER_RADIUS}`,
    `Q ${width} ${top}, ${width} ${top + BAR_CORNER_RADIUS}`,
    `V ${bottom - BAR_CORNER_RADIUS}`,
    `Q ${width} ${bottom}, ${width - BAR_CORNER_RADIUS} ${bottom}`,
    `H ${BAR_CORNER_RADIUS}`,
    `Q 0 ${bottom}, 0 ${bottom - BAR_CORNER_RADIUS}`,
    `V ${top + BAR_CORNER_RADIUS}`,
    `Q 0 ${top}, ${BAR_CORNER_RADIUS} ${top}`,
    'Z',
  ].join(' ');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${bottom}" viewBox="0 0 ${width} ${bottom}"><path d="${path}" fill="${color}"/></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function BottomNavigation({
  activeTab,
}: BottomNavigationProps) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [barWidth, setBarWidth] = useState(0);
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const backgroundSource = useMemo(
    () =>
      barWidth > 0
        ? {
            uri: createTabBarBackground(
              barWidth,
              theme.colors.surfaceElevated,
            ),
          }
        : undefined,
    [barWidth, theme.colors.surfaceElevated],
  );
  const handleLayout = (
    event: LayoutChangeEvent,
  ) => {
    const nextWidth = Math.round(
      event.nativeEvent.layout.width,
    );

    if (nextWidth !== barWidth) {
      setBarWidth(nextWidth);
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          bottom: Math.max(
            insets.bottom,
            theme.spacing.xs,
          ),
        },
      ]}
    >
      <View
        accessibilityRole="tablist"
        onLayout={handleLayout}
        style={styles.bar}
      >
        {backgroundSource ? (
          <Image
            contentFit="fill"
            pointerEvents="none"
            source={backgroundSource}
            style={styles.background}
          />
        ) : null}

        <View style={styles.row}>
          {BOTTOM_NAVIGATION_TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            const label = t(tab.labelKey);
            const tintColor = isActive
              ? theme.colors.primary
              : theme.colors.primaryMuted;

            return (
              <Pressable
                accessibilityLabel={label}
                accessibilityRole="tab"
                accessibilityState={{
                  selected: isActive,
                }}
                key={tab.key}
                onPress={() => {
                  if (!isActive) {
                    navigateToBottomTab(
                      activeTab,
                      tab.key,
                    );
                  }
                }}
                style={({ pressed }) => [
                  styles.tab,
                  tab.isCenter &&
                    styles.centerTab,
                  pressed && styles.pressed,
                ]}
              >
                {tab.isCenter ? (
                  <View style={styles.centerButton}>
                    <TablerIcon
                      color={theme.colors.white}
                      name="plantPot"
                      size={28}
                    />
                  </View>
                ) : (
                  <View style={styles.itemContent}>
                    <View
                      style={[
                        styles.iconSlot,
                        !isActive && styles.inactiveIcon,
                      ]}
                    >
                      {tab.isMyPlants ? (
                        <TablerMyPlantsIcon
                          color={theme.colors.primary}
                        />
                      ) : tab.isProfile ? (
                        <TablerIcon
                          color={theme.colors.primary}
                          name="user"
                          size={21}
                        />
                      ) : tab.key === 'calendar' ? (
                        <TablerCalendarIcon
                          color={theme.colors.primary}
                        />
                      ) : (
                        <TablerPlusIcon
                          color={theme.colors.primary}
                        />
                      )}
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.label,
                        {
                          color: tintColor,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    layout,
    radius,
    shadows,
    spacing,
  } = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.transparent,
      height: BOTTOM_NAVIGATION_HEIGHT,
      left: 0,
      paddingHorizontal: spacing.sm,
      position: 'absolute',
      right: 0,
      zIndex: 30,
    },
    bar: {
      backgroundColor: colors.transparent,
      height: BOTTOM_NAVIGATION_HEIGHT,
      maxWidth: layout.contentMaxWidth,
      position: 'relative',
      width: '100%',
    },
    background: {
      bottom: 0,
      height: BOTTOM_NAVIGATION_HEIGHT,
      left: 0,
      position: 'absolute',
      width: '100%',
    },
    row: {
      bottom: 0,
      flexDirection: 'row',
      height: BAR_BODY_HEIGHT,
      left: 0,
      position: 'absolute',
      right: 0,
    },
    tab: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      minHeight: 48,
      paddingHorizontal: spacing.xs,
    },
    centerTab: {
      height: HOME_BUTTON_SIZE,
      transform: [
        {
          translateY: -BAR_BODY_TOP,
        },
      ],
    },
    centerButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.circle,
      height: HOME_BUTTON_SIZE,
      justifyContent: 'center',
      width: HOME_BUTTON_SIZE,
      ...shadows.card,
    },
    itemContent: {
      alignItems: 'center',
      gap: 2,
      justifyContent: 'center',
    },
    iconSlot: {
      alignItems: 'center',
      height: 23,
      justifyContent: 'center',
      width: 28,
    },
    inactiveIcon: {
      opacity: 0.58,
    },
    label: {
      fontSize: 10,
      fontWeight: theme.fontWeight.medium,
      lineHeight: 12,
    },
    pressed: {
      opacity: 0.65,
    },
  });
}
