import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme, type AppTheme } from '../theme';
import { AppText as Text } from '../theme/Typography';

type FormSectionHeaderProps = {
  title: string;
  description?: string;
};

export default function FormSectionHeader({
  title,
  description,
}: FormSectionHeaderProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fontWeight } = theme;

  return StyleSheet.create({
    title: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: fontWeight.extraBold,
      lineHeight: 26,
    },
    description: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 7,
    },
  });
}
