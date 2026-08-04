import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import { AppText as Text } from '../theme/Typography';

type LastWateredDateFieldProps = {
  value: Date | null;
  onChange: (value: Date | null) => void;
};

export function toLocalNoonIso(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0,
  ).toISOString();
}

export default function LastWateredDateField({
  value,
  onChange,
}: LastWateredDateFieldProps) {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const dateLocale =
    language === 'ko'
      ? 'ko-KR'
      : language === 'de'
        ? 'de-DE'
        : 'en-US';

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(false);

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t('editPlant.lastWateredTitle')}
      </Text>
      <Text style={styles.description}>
        {t('editPlant.lastWateredDescription')}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => setShowDatePicker(true)}
        style={({ pressed }) => [
          styles.dateButton,
          pressed && styles.dateButtonPressed,
        ]}
      >
        <Text style={styles.dateButtonText}>
          {value
            ? value.toLocaleDateString(dateLocale)
            : t('editPlant.noWateringRecord')}
        </Text>
      </Pressable>

      {value && (
        <Pressable
          accessibilityRole="button"
          onPress={() => onChange(null)}
          style={styles.clearDateButton}
        >
          <Text style={styles.clearDateText}>
            {t('editPlant.clearWateringRecord')}
          </Text>
        </Pressable>
      )}

      {showDatePicker && (
        <DateTimePicker
          accentColor={theme.colors.primary}
          maximumDate={new Date()}
          mode="date"
          onChange={handleDateChange}
          value={value ?? new Date()}
          textColor={theme.colors.textPrimary}
          themeVariant={theme.isDark ? 'dark' : 'light'}
        />
      )}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      marginTop: 20,
      padding: 18,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '800',
    },
    description: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 7,
    },
    dateButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSoft,
      borderColor: colors.borderStrong,
      borderRadius: 14,
      borderWidth: 1,
      marginTop: 16,
      paddingHorizontal: 14,
      paddingVertical: 13,
    },
    dateButtonPressed: {
      opacity: 0.65,
    },
    dateButtonText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    clearDateButton: {
      alignItems: 'center',
      paddingTop: 13,
    },
    clearDateText: {
      color: colors.danger,
      fontSize: 13,
      fontWeight: '700',
    },
  });
}
