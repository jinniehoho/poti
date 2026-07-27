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

import {
  addWateringRecord,
  deleteWateringRecord,
} from '../services/wateringService';

const BRAND_NAME = 'Poti';

export default function HomeScreen() {
    const {
    plants,
    setPlants,
    refreshPlants,
    } = usePlants();
    const [message, setMessage] = useState<string | null>(null);
    const [lastWateredPlant, setLastWateredPlant] = useState<Plant | null>(null);
    const [lastWateringRecordId, setLastWateringRecordId] = useState<number | null>(null);

const [isWatering, setIsWatering] = useState(false);
    const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
      const duePlants = plants.filter(
    (plant) =>
      plant.status === 'due_today' || plant.status === 'overdue',
  );
  const featuredPlant = duePlants[0];
  const handleWaterPlant = async (plant: Plant) => {
  if (isWatering) {
    return;
  }

  if (messageTimer.current) {
    clearTimeout(messageTimer.current);
    messageTimer.current = null;
  }

  try {
    setIsWatering(true);

    const wateringRecord =
      await addWateringRecord(plant.id);

    setLastWateredPlant(plant);
    setLastWateringRecordId(wateringRecord.id);

    await refreshPlants();

    setMessage(`${plant.name}에게 물을 줬어요.`);

    messageTimer.current = setTimeout(() => {
      setMessage(null);
      messageTimer.current = null;
    }, 5000);
  } catch (error) {
    console.error('물주기 기록 실패:', error);

    setMessage(
      '물주기를 기록하지 못했어요. 다시 시도해주세요.',
    );

    messageTimer.current = setTimeout(() => {
      setMessage(null);
      messageTimer.current = null;
    }, 5000);
  } finally {
    setIsWatering(false);
  }
};

  const handleUndo = async () => {
  if (
    !lastWateredPlant ||
    lastWateringRecordId === null
  ) {
    return;
  }

  if (messageTimer.current) {
    clearTimeout(messageTimer.current);
    messageTimer.current = null;
  }

  try {
    await deleteWateringRecord(lastWateringRecordId);

    await refreshPlants();

    setLastWateringRecordId(null);
    setLastWateredPlant(null);

    setMessage(null);
  } catch (error) {
    console.error(
      '물주기 실행 취소 실패:',
      error,
    );

    setMessage(
      '실행 취소에 실패했어요.'
    );

    messageTimer.current = setTimeout(() => {
      setMessage(null);
      messageTimer.current = null;
    }, 3000);
  }
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
