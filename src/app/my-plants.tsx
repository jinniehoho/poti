import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getPlantIllustration } from '../../assets/assets';
import BottomNavigation, {
  BOTTOM_NAVIGATION_HEIGHT,
  navigateToBottomTab,
} from '../components/BottomNavigation';
import OrganicBackground from '../components/OrganicBackground';
import PlantVisual from '../components/PlantVisual';
import SwipeTabNavigation from '../components/SwipeTabNavigation';
import { usePlants } from '../context/PlantContext';
import { useLanguage } from '../preferences/LanguageContext';
import { useTheme, type AppTheme } from '../theme';
import { AppText as Text } from '../theme/Typography';
import type { Plant } from '../types/plant';

export default function MyPlantsScreen() {
  const {
    plants,
    isLoadingPlants,
    plantsError,
  } = usePlants();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderPlant: ListRenderItem<Plant> = ({ item }) => {
    const hasTemperature =
      item.temperatureMinC !== null &&
      item.temperatureMaxC !== null;
    const hasHumidity =
      item.humidityMin !== null &&
      item.humidityMax !== null;

    return (
      <Pressable
        accessibilityLabel={t('home.openPlant', {
          name: item.name,
        })}
        accessibilityRole="button"
        onPress={() => router.push(`/plant/${item.id}`)}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.visualFrame}>
          <PlantVisual
            backgroundColor={theme.colors.transparent}
            emoji={item.emoji}
            imageSource={getPlantIllustration(item.imageKey)}
            imageStyle={styles.plantImage}
            size="medium"
            style={styles.plantVisual}
          />
        </View>

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.typeName}>
            {item.typeName}
          </Text>

          {item.locationName ? (
            <Text numberOfLines={1} style={styles.location}>
              {item.locationName}
            </Text>
          ) : null}

          <Text
            numberOfLines={1}
            style={[
              styles.watering,
              item.status === 'due_today' && styles.wateringDue,
              item.status === 'overdue' && styles.wateringOverdue,
            ]}
          >
            💧 {item.statusText}
          </Text>

          {hasTemperature ||
          hasHumidity ||
          item.petToxic !== null ? (
            <View style={styles.careDetails}>
              {hasTemperature ? (
                <Text style={styles.careText}>
                  🌡 {item.temperatureMinC}~{item.temperatureMaxC} °C
                </Text>
              ) : null}
              {hasHumidity ? (
                <Text style={styles.careText}>
                  💦 {item.humidityMin}~{item.humidityMax} %
                </Text>
              ) : null}
              {item.petToxic !== null ? (
                <Text style={styles.careText}>
                  🐾 {item.petToxic
                    ? t('myPlants.petToxic')
                    : t('myPlants.petSafe')}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const emptyContent = isLoadingPlants ? (
    <Text style={styles.message}>{t('home.plantsLoading')}</Text>
  ) : plantsError ? (
    <Text style={[styles.message, styles.error]}>{plantsError}</Text>
  ) : (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>
        {t('myPlants.emptyTitle')}
      </Text>
      <Text style={styles.emptyDescription}>
        {t('myPlants.emptyDescription')}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigateToBottomTab('myPlants', 'addPlant')}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.cardPressed,
        ]}
      >
        <Text style={styles.addButtonText}>{t('home.addPlant')}</Text>
      </Pressable>
    </View>
  );

  return (
    <SwipeTabNavigation activeTab="myPlants" style={styles.root}>
      <OrganicBackground variant="home" />
      <FlatList
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              BOTTOM_NAVIGATION_HEIGHT +
              Math.max(insets.bottom, theme.spacing.sm) +
              theme.spacing.xl,
            paddingTop: Math.max(
              theme.spacing.screenTop,
              insets.top + theme.spacing.sm,
            ),
          },
        ]}
        data={plants}
        keyExtractor={(plant) => String(plant.id)}
        ListEmptyComponent={emptyContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('home.myPlants')}</Text>
            <Text style={styles.count}>
              {plants.length === 1
                ? t('home.plantCountOne')
                : t('home.plantCount', { count: plants.length })}
            </Text>
          </View>
        }
        renderItem={renderPlant}
        showsVerticalScrollIndicator={false}
      />
      <BottomNavigation activeTab="myPlants" />
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
    shadows,
    spacing,
  } = theme;

  return StyleSheet.create({
    root: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      alignSelf: 'center',
      maxWidth: layout.contentMaxWidth,
      paddingHorizontal: spacing.screenHorizontal,
      width: '100%',
    },
    header: {
      alignItems: 'baseline',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
    },
    title: {
      color: colors.textPrimary,
      fontSize: fontSize.title,
      fontWeight: fontWeight.extraBold,
    },
    count: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
    },
    card: {
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      flexDirection: 'row',
      marginBottom: spacing.lg,
      minHeight: 146,
      padding: spacing.lg,
      ...shadows.card,
    },
    cardPressed: {
      opacity: 0.68,
    },
    visualFrame: {
      alignItems: 'center',
      backgroundColor: colors.primaryFaint,
      borderRadius: radius.xl,
      height: 112,
      justifyContent: 'center',
      overflow: 'hidden',
      width: 112,
    },
    plantVisual: {
      height: 108,
      width: 108,
    },
    plantImage: {
      height: '100%',
      width: '100%',
    },
    info: {
      flex: 1,
      marginLeft: spacing.lg,
      minWidth: 0,
    },
    name: {
      color: colors.textPrimary,
      fontSize: fontSize.cardTitle,
      fontWeight: fontWeight.extraBold,
    },
    typeName: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      marginTop: spacing.xs,
    },
    location: {
      color: colors.primary,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      marginTop: spacing.sm,
    },
    watering: {
      color: colors.statusNormal,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      marginTop: spacing.sm,
    },
    wateringDue: {
      color: colors.statusToday,
    },
    wateringOverdue: {
      color: colors.statusOverdue,
    },
    careDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    careText: {
      color: colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
    },
    message: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      paddingVertical: spacing.xxxl,
      textAlign: 'center',
    },
    error: {
      color: colors.danger,
    },
    emptyCard: {
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.xl,
      padding: spacing.xxxl,
      ...shadows.card,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: fontSize.cardTitle,
      fontWeight: fontWeight.extraBold,
      textAlign: 'center',
    },
    emptyDescription: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 21,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      marginTop: spacing.xl,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    addButtonText: {
      color: colors.textInverse,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.extraBold,
    },
  });
}
