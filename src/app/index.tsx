import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import BrandHeader from '../components/BrandHeader';
import FeedbackBar from '../components/FeedbackBar';
import PlantGrid from '../components/PlantGrid';
import TodayCard from '../components/TodayCard';
import { usePlants } from '../context/PlantContext';
import {
  addWateringRecord,
  deleteWateringRecord,
} from '../services/wateringService';
import type { Plant } from '../types/plant';

const BRAND_NAME = 'Poti';

export default function HomeScreen() {
  const {
    plants,
    refreshPlants,
  } = usePlants();

  const [message, setMessage] =
    useState<string | null>(null);

  const [lastWateredPlant, setLastWateredPlant] =
    useState<Plant | null>(null);

  const [
    lastWateringRecordId,
    setLastWateringRecordId,
  ] = useState<number | null>(null);

  const [isWatering, setIsWatering] =
    useState(false);

  const messageTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const duePlants = plants.filter(
    (plant) =>
      plant.status === 'due_today' ||
      plant.status === 'overdue',
  );

  /*
   * getPlants()가 다음 물주기일이 빠른 순서로
   * 식물을 가져오므로 첫 번째 식물이 가장 급하다.
   */
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
      await deleteWateringRecord(
        lastWateringRecordId,
      );

      await refreshPlants();

      setLastWateringRecordId(null);
      setLastWateredPlant(null);
      setMessage(null);
    } catch (error) {
      console.error(
        '물주기 실행 취소 실패:',
        error,
      );

      setMessage('실행 취소에 실패했어요.');

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

      <Text style={styles.sectionTitle}>
        오늘 돌볼 식물
      </Text>

      <TodayCard
        plant={featuredPlant}
        onWater={handleWaterPlant}
        isWatering={isWatering}
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

  sectionTitle: {
    color: '#283526',
    fontSize: 19,
    fontWeight: '800',
  },
});