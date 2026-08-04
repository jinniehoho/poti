import { useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text } from '../../theme/Typography';
import PlantVisual from '../PlantVisual';
import { getPlantIllustration } from '../../../assets/assets';
import {
  useTheme,
  type AppTheme,
} from '../../theme';

type PlantDetailHeaderProps = {
  emoji: string;
  name: string;
  typeName: string;
  scientificName?: string | null;
  imageKey?: string | null;
};

export default function PlantDetailHeader({
  emoji,
  name,
  typeName,
  scientificName,
  imageKey,
}: PlantDetailHeaderProps) {
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <View style={styles.header}>
      <PlantVisual
        backgroundColor={theme.colors.transparent}
        emoji={emoji}
        imageSource={getPlantIllustration(imageKey)}
        imageStyle={styles.heroImage}
        size="large"
        style={styles.heroVisual}
      />

      <View style={styles.identity}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.typeName}>{typeName}</Text>
        {scientificName ? (
          <Text style={styles.scientificName}>
            {scientificName}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fontSize, fontWeight, spacing } = theme;

  return StyleSheet.create({
  header: {
    alignItems: 'center',
    height: 270,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },

  heroVisual: {
    width: 270,
    height: 270,
    backgroundColor: colors.transparent,
    borderRadius: 0,
    overflow: 'hidden',
  },

  heroImage: {
    width: '100%',
    height: '100%',
    transform: [
      { scale: 1.18 },
      { translateY: 2 },
    ],
  },

  identity: {
    alignItems: 'flex-start',
    bottom: 56,
    left: 22,
    position: 'absolute',
    width: '38%',
    zIndex: 2,
  },

  name: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.extraBold,
    lineHeight: 31,
  },

  typeName: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },

  scientificName: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    fontStyle: 'italic',
    lineHeight: 17,
    marginTop: spacing.xs,
  },
  });
}
