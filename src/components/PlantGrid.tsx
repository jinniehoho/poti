import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';

import type { Plant } from '../types/plant';

type PlantGridProps = {
  plants: Plant[];
  onAddPlant: () => void;
};

export default function PlantGrid({
  plants,
  onAddPlant,
}: PlantGridProps) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>내 식물</Text>
        <Text style={styles.plantCount}>{plants.length}개</Text>
      </View>

      <View style={styles.plantRow}>
        {plants.map((plant) => (
      <Pressable
        key={plant.id}
        accessibilityRole="button"
        accessibilityLabel={`${plant.name} 상세 정보 열기`}
        onPress={() => router.push(`/plant/${plant.id}`)}
        style={({ pressed }) => [
        styles.plantItem,
        pressed && styles.plantItemPressed,
    ]}
  >
      <View style={styles.plantCircle}>
        <Text style={styles.plantEmoji}>{plant.emoji}</Text>
      </View>

      <Text
        numberOfLines={1}
        style={styles.plantName}
      >
        {plant.name}
      </Text>

      <Text
        numberOfLines={1}
        style={styles.plantStatus}
      >
        {plant.statusText}
      </Text>
    </Pressable>
))}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="새 식물 추가"
          onPress={onAddPlant}
          style={({ pressed }) => [
            styles.plantItem,
            pressed && styles.addItemPressed,
            ]}
>
  <View style={[styles.plantCircle, styles.addCircle]}>
    <Text style={styles.addIcon}>＋</Text>
  </View>

  <Text style={styles.plantName}>식물 추가</Text>
  <Text style={styles.plantStatus}>새 화분</Text>
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
    paddingHorizontal: 6,
    marginBottom: 20,
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
  },

  plantEmoji: {
    fontSize: 35,
  },

  plantName: {
    width: '100%',
    color: '#344032',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 9,
  },

  plantStatus: {
    width: '100%',
    color: '#879081',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 3,
  },

  addCircle: {
    borderWidth: 1.5,
    borderColor: '#B8C3B2',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
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