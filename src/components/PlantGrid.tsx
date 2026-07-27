import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Plant } from '../types/plant';

type PlantGridProps = {
  plants: Plant[];
  onAddPlant: () => void;
};

function getPlantStatusLabel(plant: Plant) {
  const days = Number.parseInt(
    plant.statusText,
    10,
  );

  if (plant.status === 'due_today') {
    return '오늘 물 주세요';
  }

  if (plant.status === 'overdue') {
    if (!Number.isInteger(days)) {
      return '물주기가 늦었어요';
    }

    if (days === 1) {
      return '하루 늦었어요';
    }

    return `${days}일 늦었어요`;
  }

  if (!Number.isInteger(days)) {
    return plant.statusText;
  }

  if (days === 1) {
    return '내일 물 주는 날';
  }

  return `${days}일 남았어요`;
}

export default function PlantGrid({
  plants,
  onAddPlant,
}: PlantGridProps) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          내 식물
        </Text>

        <Text style={styles.plantCount}>
          {plants.length}개
        </Text>
      </View>

      <View style={styles.plantRow}>
        {plants.map((plant) => {
          const isDueToday =
            plant.status === 'due_today';

          const isOverdue =
            plant.status === 'overdue';

          return (
            <Pressable
              key={plant.id}
              accessibilityRole="button"
              accessibilityLabel={
                `${plant.name} 상세 정보 열기`
              }
              onPress={() =>
                router.push(`/plant/${plant.id}`)
              }
              style={({ pressed }) => [
                styles.plantItem,
                pressed && styles.plantItemPressed,
              ]}
            >
              <View
                style={[
                  styles.plantCircle,
                  isDueToday &&
                    styles.dueTodayCircle,
                  isOverdue &&
                    styles.overdueCircle,
                ]}
              >
                <Text style={styles.plantEmoji}>
                  {plant.emoji}
                </Text>
              </View>

              <Text
                numberOfLines={1}
                style={styles.plantName}
              >
                {plant.name}
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  styles.plantStatus,
                  isDueToday &&
                    styles.dueTodayStatus,
                  isOverdue &&
                    styles.overdueStatus,
                ]}
              >
                {getPlantStatusLabel(plant)}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="새 식물 추가"
          onPress={onAddPlant}
          style={({ pressed }) => [
            styles.plantItem,
            pressed && styles.addItemPressed,
          ]}
        >
          <View
            style={[
              styles.plantCircle,
              styles.addCircle,
            ]}
          >
            <Text style={styles.addIcon}>＋</Text>
          </View>

          <Text style={styles.plantName}>
            식물 추가
          </Text>

          <Text style={styles.plantStatus}>
            새 화분
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 36,
  },

  sectionTitle: {
    color: '#283526',
    fontSize: 19,
    fontWeight: '800',
  },

  plantCount: {
    color: '#75806F',
    fontSize: 14,
    fontWeight: '700',
  },

  plantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginTop: 15,
  },

  plantItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 6,
  },

  plantItemPressed: {
    opacity: 0.65,
  },

  plantCircle: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  dueTodayCircle: {
    backgroundColor: '#EEF6E8',
    borderColor: '#89A67F',
  },

  overdueCircle: {
    backgroundColor: '#FFF2ED',
    borderColor: '#C67A6E',
  },

  plantEmoji: {
    fontSize: 35,
  },

  plantName: {
    width: '100%',
    color: '#344032',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 9,
    textAlign: 'center',
  },

  plantStatus: {
    width: '100%',
    minHeight: 28,
    color: '#879081',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 3,
    textAlign: 'center',
  },

  dueTodayStatus: {
    color: '#48683F',
    fontWeight: '800',
  },

  overdueStatus: {
    color: '#A34F42',
    fontWeight: '800',
  },

  addCircle: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#B8C3B2',
    borderStyle: 'dashed',
  },

  addIcon: {
    color: '#65745F',
    fontSize: 30,
    fontWeight: '400',
  },

  addItemPressed: {
    opacity: 0.65,
  },
});