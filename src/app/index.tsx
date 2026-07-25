import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import FeedbackBar from '../components/FeedbackBar';
import BrandHeader from '../components/BrandHeader';
import TodayCard from '../components/TodayCard';
import PlantGrid from '../components/PlantGrid';
import { router } from 'expo-router';
import { usePlants } from '../context/PlantContext';

import {
  colors,
  fontSize,
  radius,
  shadows,
  spacing,
} from '../constants/theme';

import type { Plant } from '../types/plant';

const BRAND_NAME = 'Poti';

export default function HomeScreen() {
    const { plants, setPlants } = usePlants();
    const [message, setMessage] = useState<string | null>(null);
    const [lastWateredPlant, setLastWateredPlant] = useState<Plant | null>(null);
    const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
      const duePlants = plants.filter(
    (plant) =>
      plant.status === 'due_today' || plant.status === 'overdue',
  );
  const featuredPlant = duePlants[0];
  const handleWaterPlant = (plant: Plant) => {
    setLastWateredPlant(plant);

    setPlants((currentPlants) =>
      currentPlants.map((currentPlant) =>
        currentPlant.id === plant.id
          ? {
              ...currentPlant,
              status: 'not_due',
              statusText: '7일 후',
            }
          : currentPlant,
      ),
    );

  setMessage(`${plant.name}의 물주기를 기록했어요.`);

  if (messageTimer.current) {
  clearTimeout(messageTimer.current);
}

messageTimer.current = setTimeout(() => {
  setMessage(null);
  setLastWateredPlant(null);
  messageTimer.current = null;
}, 5000);
  };

  const handleUndo = () => {
  if (!lastWateredPlant) {
    return;
  }

  if (messageTimer.current) {
    clearTimeout(messageTimer.current);
    messageTimer.current = null;
  }

  setPlants((currentPlants) =>
    currentPlants.map((plant) =>
      plant.id === lastWateredPlant.id
        ? lastWateredPlant
        : plant,
    ),
  );

  setMessage('물주기 기록을 취소했어요.');
  setLastWateredPlant(null);

  messageTimer.current = setTimeout(() => {
    setMessage(null);
    messageTimer.current = null;
  }, 2000);
};

const handleAddPlant = () => {
  router.push('/add-plant');
};

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <BrandHeader brandName={BRAND_NAME} />

      <Text style={styles.sectionTitle}>오늘 물 줄 식물</Text>

      <TodayCard
  plant={featuredPlant}
  onWater={handleWaterPlant}
/>

{message && (
  <FeedbackBar
    message={message}
    showUndo={lastWateredPlant !== null}
    onUndo={handleUndo}
  />
)}

      <PlantGrid
  plants={plants}
  onAddPlant={handleAddPlant}
/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7F2',
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 56,
    paddingBottom: 48,
  },
  eyebrow: {
    color: '#6B7D62',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#283526',
    fontSize: 19,
    fontWeight: '800',
  },
});
