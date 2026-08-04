import { useMemo } from 'react';
import {
  Image,
  type ImageStyle,
  type ImageSourcePropType,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import { useTheme } from '../theme/ThemeContext';
import type { AppTheme } from '../theme/themes';

type PlantVisualSize =
  | 'small'
  | 'medium'
  | 'large';

type PlantVisualProps = {
  emoji?: string;
  imageSource?: ImageSourcePropType;
  size?: PlantVisualSize;
  backgroundColor?: string;
  style?: ViewStyle;
  imageStyle?: StyleProp<ImageStyle>;
};

const sizeValues = {
  small: {
    container: 70,
    emoji: 35,
  },

  medium: {
    container: 112,
    emoji: 58,
  },

  large: {
    container: 148,
    emoji: 72,
  },
} as const;

export default function PlantVisual({
  emoji = '🌱',
  imageSource,
  size = 'medium',
  backgroundColor,
  style,
  imageStyle,
}: PlantVisualProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  const selectedSize = sizeValues[size];

  const resolvedBackgroundColor =
    backgroundColor ??
    theme.colors.surfaceElevated;

  return (
    <View
      style={[
        styles.container,
        {
          width: selectedSize.container,
          height: selectedSize.container,
          backgroundColor:
            resolvedBackgroundColor,
        },
        style,
      ]}
    >
      {imageSource ? (
        <Image
          resizeMode="contain"
          source={imageSource}
          style={[styles.image, imageStyle]}
        />
      ) : (
        <Text
          style={{
            fontSize: selectedSize.emoji,
          }}
        >
          {emoji}
        </Text>
      )}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { radius } = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.circle,
      overflow: 'hidden',
    },

    image: {
      width: '82%',
      height: '82%',
    },
  });
}
