import {
  Stack,
  useLocalSearchParams,
} from 'expo-router';
import {
  PanResponder,
  Platform,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  useMemo,
  type ReactNode,
} from 'react';

import {
  navigateToBottomTab,
  type BottomNavigationTab,
} from './BottomNavigation';

type SwipeTabNavigationProps = {
  activeTab: BottomNavigationTab;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const HORIZONTAL_INTENT_DISTANCE = 14;
const SWIPE_DISTANCE = 72;
const SWIPE_VELOCITY = 0.45;
const MIN_FAST_SWIPE_DISTANCE = 30;
const DIRECTION_RATIO = 1.5;

const SWIPE_TAB_ORDER: readonly BottomNavigationTab[] = [
  'calendar',
  'home',
  'myPlants',
  'addPlant',
  'profile',
];

function isHorizontalIntent(
  dx: number,
  dy: number,
) {
  return (
    Math.abs(dx) >= HORIZONTAL_INTENT_DISTANCE &&
    Math.abs(dx) > Math.abs(dy) * DIRECTION_RATIO
  );
}

export default function SwipeTabNavigation({
  activeTab,
  children,
  style,
}: SwipeTabNavigationProps) {
  const { tabDirection } = useLocalSearchParams<{
    tabDirection?: 'forward' | 'backward';
  }>();
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          isHorizontalIntent(
            gestureState.dx,
            gestureState.dy,
          ),
        onMoveShouldSetPanResponderCapture: (
          _,
          gestureState,
        ) =>
          isHorizontalIntent(
            gestureState.dx,
            gestureState.dy,
          ),
        onPanResponderRelease: (_, gestureState) => {
          const isHorizontal = isHorizontalIntent(
            gestureState.dx,
            gestureState.dy,
          );
          const isDistanceSwipe =
            Math.abs(gestureState.dx) >= SWIPE_DISTANCE;
          const isFastSwipe =
            Math.abs(gestureState.dx) >=
              MIN_FAST_SWIPE_DISTANCE &&
            Math.abs(gestureState.vx) >= SWIPE_VELOCITY;

          if (
            !isHorizontal ||
            (!isDistanceSwipe && !isFastSwipe)
          ) {
            return;
          }

          const currentIndex =
            SWIPE_TAB_ORDER.indexOf(activeTab);
          const direction =
            gestureState.dx < 0 ? 1 : -1;
          const nextTab =
            SWIPE_TAB_ORDER[
              currentIndex + direction
            ];

          if (nextTab) {
            navigateToBottomTab(
              activeTab,
              nextTab,
              direction > 0
                ? 'forward'
                : 'backward',
            );
          }
        },
        onPanResponderTerminationRequest: () => true,
      }),
    [activeTab],
  );

  return (
    <>
      <Stack.Screen
        options={{
          animation:
            Platform.OS === 'ios'
              ? 'simple_push'
              : tabDirection === 'backward'
                ? 'slide_from_left'
                : 'slide_from_right',
          animationDuration: 180,
          animationTypeForReplace:
            tabDirection === 'backward'
              ? 'pop'
              : 'push',
        }}
      />
      <View
        {...panResponder.panHandlers}
        style={style}
      >
        {children}
      </View>
    </>
  );
}
