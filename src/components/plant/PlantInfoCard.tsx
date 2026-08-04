import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText as Text } from '@/theme/Typography';
import { useLanguage } from '../../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../../theme';
import TablerIcon, {
  type TablerIconName,
} from '../TablerIcon';

type PlantInfoCardProps = {
  intervalDays: number;
  statusLabel: string;
  lastWateredLabel: string;
  nextWateringLabel: string;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
  humidityMin: number | null;
  humidityMax: number | null;
  petToxic: boolean | null;
};

type InfoRowProps = {
  icon: TablerIconName;
  label: string;
  value: string;
  isLast?: boolean;
};

function InfoRow({
  icon,
  label,
  value,
  isLast = false,
}: InfoRowProps) {
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <View
      style={[
        styles.infoRow,
        isLast && styles.lastInfoRow,
      ]}
    >
      <View style={styles.infoIcon}>
        <TablerIcon
          color={theme.colors.primary}
          name={icon}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function PlantInfoCard({
  intervalDays,
  statusLabel,
  lastWateredLabel,
  nextWateringLabel,
  temperatureMinC,
  temperatureMaxC,
  humidityMin,
  humidityMax,
  petToxic,
}: PlantInfoCardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  const rows: Omit<InfoRowProps, 'isLast'>[] = [
    {
      icon: 'droplet',
      label: t('plantDetail.watering'),
      value: t('plantDetail.wateringEveryDays', {
        days: intervalDays,
      }),
    },
    {
      icon: 'leaf',
      label: t('plantDetail.currentStatus'),
      value: statusLabel,
    },
    {
      icon: 'bucketDroplet',
      label: t('plantDetail.lastWatering'),
      value: lastWateredLabel,
    },
    {
      icon: 'clockEdit',
      label: t('plantDetail.nextWatering'),
      value: nextWateringLabel,
    },
  ];

  if (
    temperatureMinC !== null &&
    temperatureMaxC !== null
  ) {
    rows.push({
      icon: 'temperatureSun',
      label: t('plantDetail.temperature'),
      value: `${temperatureMinC}~${temperatureMaxC} °C`,
    });
  }

  if (
    humidityMin !== null &&
    humidityMax !== null
  ) {
    rows.push({
      icon: 'droplets',
      label: t('plantDetail.humidity'),
      value: `${humidityMin}~${humidityMax} %`,
    });
  }

  rows.push({
    icon: 'paw',
    label: t('plantDetail.petSafety'),
    value:
      petToxic === true
        ? t('plantDetail.petToxic')
        : petToxic === false
          ? t('plantDetail.petSafe')
          : t('plantDetail.noInformation'),
  });

  return (
    <View style={styles.infoCard}>
      {rows.map((row, index) => (
        <InfoRow
          {...row}
          isLast={index === rows.length - 1}
          key={row.label}
        />
      ))}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
  infoCard: {
    width: '100%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 28,
    padding: 22,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  lastInfoRow: {
    marginBottom: 0,
  },

  infoIcon: {
    width: 34,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },

  infoValue: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  });
}
