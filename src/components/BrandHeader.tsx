import { StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontSize,
  spacing,
} from '../constants/theme';

type BrandHeaderProps = {
  brandName: string;
};

export default function BrandHeader({
  brandName,
}: BrandHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Text style={styles.brandName}>{brandName}</Text>
        <Text style={styles.brandLeaf}>🌿</Text>
      </View>

      <Text style={styles.title}>오늘도 잘 자라고 있어요</Text>

      <Text style={styles.subtitle}>
        물이 필요한 식물을 확인하고 바로 기록하세요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xxl,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  brandName: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  brandLeaf: {
    fontSize: 18,
    marginLeft: spacing.sm,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: '800',
    lineHeight: 36,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.bodySmall,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});