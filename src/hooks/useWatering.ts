import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { usePlants } from '../context/PlantContext';
import { useLanguage } from '../preferences/LanguageContext';
import {
  addWateringRecord,
  deleteWateringRecord,
} from '../services/wateringService';
import type { Plant } from '../types/plant';
import { playLightCareHaptic } from '../utils/haptics';

type UseWateringOptions = {
  onRefreshStatistics?: () => Promise<void>;
  onRefreshCalendar?: () => Promise<void>;
};

export function useWatering({
  onRefreshStatistics,
  onRefreshCalendar,
}: UseWateringOptions = {}) {

  const { refreshPlants } = usePlants();
  const { t } = useLanguage();

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
  const [completionPlant, setCompletionPlant] =
    useState<Plant | null>(null);
  const [completionKey, setCompletionKey] =
    useState(0);
  const [didCompleteCare, setDidCompleteCare] =
    useState(false);

  const messageTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
  const completionTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
  const wateringInFlightRef = useRef(false);

  useEffect(
    () => () => {
      if (messageTimer.current) {
        clearTimeout(messageTimer.current);
      }

      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
      }
    },
    [],
  );

  const waterPlant = async (plant: Plant) => {
    if (wateringInFlightRef.current) {
      return;
    }

    wateringInFlightRef.current = true;

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
      setCompletionPlant(plant);
      setCompletionKey((current) => current + 1);
      setDidCompleteCare(true);

      void playLightCareHaptic();

      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
      }

      completionTimer.current = setTimeout(() => {
        setCompletionPlant(null);
        completionTimer.current = null;
      }, 1900);

      await refreshPlants();

      if (onRefreshStatistics) {
        await onRefreshStatistics();
      }

      if (onRefreshCalendar) {
        await onRefreshCalendar();
      }

      setMessage(
        t('home.wateredMessage', {
          name: plant.name,
        }),
      );

      messageTimer.current = setTimeout(() => {
        setMessage(null);
        messageTimer.current = null;
      }, 5000);
    } catch (error) {
      console.error('Watering record failed:', error);

      setMessage(t('home.wateringError'));

      messageTimer.current = setTimeout(() => {
        setMessage(null);
        messageTimer.current = null;
      }, 5000);
    } finally {
      wateringInFlightRef.current = false;
      setIsWatering(false);
    }
  };

  const undoWatering = async () => {
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

    if (completionTimer.current) {
      clearTimeout(completionTimer.current);
      completionTimer.current = null;
    }

    try {
      await deleteWateringRecord(
        lastWateringRecordId,
      );

      await refreshPlants();

      if (onRefreshStatistics) {
        await onRefreshStatistics();
      }

      if (onRefreshCalendar) {
        await onRefreshCalendar();
      }

      setLastWateringRecordId(null);
      setLastWateredPlant(null);
      setCompletionPlant(null);
      setDidCompleteCare(false);
      setMessage(null);
    } catch (error) {
      console.error('Undo watering failed:', error);

      setMessage(t('home.undoError'));

      messageTimer.current = setTimeout(() => {
        setMessage(null);
        messageTimer.current = null;
      }, 3000);
    }
  };

  return {
    waterPlant,
    undoWatering,
    message,
    lastWateredPlant,
    isWatering,
    completionPlant,
    completionKey,
    didCompleteCare,
  };
}
