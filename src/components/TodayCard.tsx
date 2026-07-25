import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Plant } from '../types/plant';

type TodayCardProps = {
  plant?: Plant;
  onWater: (plant: Plant) => void;
};

export default function TodayCard({
  plant,
  onWater,
}: TodayCardProps) {
  if (!plant) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyEmoji}>🌿</Text>
        <Text style={styles.emptyTitle}>오늘은 모두 괜찮아요</Text>
        <Text style={styles.emptyText}>
          지금 물을 줘야 하는 식물이 없어요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.featuredCard}>
      <View style={styles.featuredIcon}>
        <Text style={styles.featuredEmoji}>{plant.emoji}</Text>
      </View>

      <Text style={styles.featuredLabel}>물 줄 시간이에요</Text>
      <Text style={styles.featuredName}>{plant.name}</Text>
      <Text style={styles.featuredType}>{plant.typeName}</Text>

      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>{plant.statusText}</Text>
      </View>

      <Pressable
        onPress={() => onWater(plant)}
        style={({ pressed }) => [
          styles.waterButton,
          pressed && styles.waterButtonPressed,
        ]}
      >
        <Text style={styles.waterButtonText}>💧 물 줬어요</Text>
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

  featuredIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#F8FBF5',
    marginBottom: 20,
  },

  featuredEmoji: {
    fontSize: 58,
  },

  featuredLabel: {
    color: '#65745F',
    fontSize: 14,
    fontWeight: '700',
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

  statusBadgeText: {
    color: '#52654C',
    fontSize: 13,
    fontWeight: '800',
  },

  waterButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#355E3B',
    borderRadius: 18,
    marginTop: 24,
    paddingVertical: 16,
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
    marginTop: 7,
  },
});