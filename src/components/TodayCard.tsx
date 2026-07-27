import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Plant } from '../types/plant';

type TodayCardProps = {
  plant?: Plant;
  onWater: (plant: Plant) => void;
  isWatering: boolean;
};

function getOverdueLabel(statusText: string) {
  const days = Number.parseInt(statusText, 10);

  if (!Number.isInteger(days)) {
    return '물주기가 늦었어요';
  }

  if (days === 1) {
    return '하루 늦었어요';
  }

  return `${days}일 늦었어요`;
}

export default function TodayCard({
  plant,
  onWater,
  isWatering,
}: TodayCardProps) {
  if (!plant) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyEmoji}>🌿</Text>

        <Text style={styles.emptyTitle}>
          오늘은 모두 괜찮아요
        </Text>

        <Text style={styles.emptyText}>
          지금 바로 물을 줘야 하는 식물이 없어요.
        </Text>
      </View>
    );
  }

  const isOverdue = plant.status === 'overdue';

  const featuredLabel = isOverdue
    ? '물을 기다리고 있어요'
    : '오늘 물을 주세요';

  const statusLabel = isOverdue
    ? `⚠️ ${getOverdueLabel(plant.statusText)}`
    : '오늘 물 주는 날';

  return (
    <View
      style={[
        styles.featuredCard,
        isOverdue && styles.overdueCard,
      ]}
    >
      <View
        style={[
          styles.featuredIcon,
          isOverdue && styles.overdueIcon,
        ]}
      >
        <Text style={styles.featuredEmoji}>
          {plant.emoji}
        </Text>
      </View>

      <Text
        style={[
          styles.featuredLabel,
          isOverdue && styles.overdueLabel,
        ]}
      >
        {featuredLabel}
      </Text>

      <Text style={styles.featuredName}>
        {plant.name}
      </Text>

      <Text style={styles.featuredType}>
        {plant.typeName}
      </Text>

      <View
        style={[
          styles.statusBadge,
          isOverdue && styles.overdueBadge,
        ]}
      >
        <Text
          style={[
            styles.statusBadgeText,
            isOverdue &&
              styles.overdueBadgeText,
          ]}
        >
          {statusLabel}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${plant.name}에게 물주기`}
        disabled={isWatering}
        onPress={() => onWater(plant)}
        style={({ pressed }) => [
          styles.waterButton,
          isOverdue && styles.overdueWaterButton,
          isWatering && styles.waterButtonDisabled,
          pressed &&
            !isWatering &&
            styles.waterButtonPressed,
        ]}
      >
        <Text style={styles.waterButtonText}>
          {isWatering
            ? '기록하고 있어요...'
            : '💧 물 줬어요'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    alignItems: 'center',
    backgroundColor: '#DDEBD5',
    borderRadius: 30,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  overdueCard: {
    backgroundColor: '#F3DDD5',
  },

  featuredIcon: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FBF5',
    borderRadius: 56,
    marginBottom: 20,
  },

  overdueIcon: {
    backgroundColor: '#FFF8F4',
  },

  featuredEmoji: {
    fontSize: 58,
  },

  featuredLabel: {
    color: '#65745F',
    fontSize: 14,
    fontWeight: '700',
  },

  overdueLabel: {
    color: '#9A5146',
  },

  featuredName: {
    color: '#20301E',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 5,
  },

  featuredType: {
    color: '#73806E',
    fontSize: 14,
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: '#F7FAF4',
    borderRadius: 999,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  overdueBadge: {
    backgroundColor: '#FFF5F1',
  },

  statusBadgeText: {
    color: '#52654C',
    fontSize: 13,
    fontWeight: '800',
  },

  overdueBadgeText: {
    color: '#A34F42',
  },

  waterButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#355E3B',
    borderRadius: 18,
    marginTop: 24,
    paddingVertical: 16,
  },

  overdueWaterButton: {
    backgroundColor: '#8E493F',
  },

  waterButtonDisabled: {
    opacity: 0.55,
  },

  waterButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  waterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginTop: 16,
    padding: 30,
  },

  emptyEmoji: {
    fontSize: 46,
  },

  emptyTitle: {
    color: '#263324',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
  },

  emptyText: {
    color: '#7B8477',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    textAlign: 'center',
  },
});