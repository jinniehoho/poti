import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import PlantNameCard from '../../../components/PlantNameCard';
import PlantTypeCard, {
  type PlantTypeOption,
} from '../../../components/PlantTypeCard';
import WateringModeCard, {
  type WateringMode,
} from '../../../components/WateringModeCard';
import { usePlants } from '../../../context/PlantContext';
import {
  getEditablePlantById,
  updatePlant,
} from '../../../services/plantService';
import { getPlantTypes } from '../../../services/plantTypeService';

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshPlants } = usePlants();

  const [plantTypeOptions, setPlantTypeOptions] =
    useState<PlantTypeOption[]>([]);

  const [plantName, setPlantName] = useState('');

  const [selectedPlantTypeId, setSelectedPlantTypeId] =
    useState<number | null>(null);

  const [wateringMode, setWateringMode] =
    useState<WateringMode>('automatic');

  const [customWateringDays, setCustomWateringDays] =
    useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadEditData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const plantId = Number(id);

        if (!Number.isInteger(plantId)) {
          throw new Error('잘못된 식물 ID입니다.');
        }

        const [plantTypes, plant] = await Promise.all([
          getPlantTypes(),
          getEditablePlantById(plantId),
        ]);

        setPlantTypeOptions(plantTypes);
        setPlantName(plant.displayName);
        setSelectedPlantTypeId(plant.plantTypeId);
        setWateringMode(plant.wateringMode);

        setCustomWateringDays(
          plant.customIntervalDays !== null
            ? String(plant.customIntervalDays)
            : '',
        );
      } catch (error) {
        console.error('수정할 식물 정보 조회 실패:', error);

        setLoadError(
          '식물 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadEditData();
  }, [id]);

  const selectedPlantType = plantTypeOptions.find(
    (option) => option.id === selectedPlantTypeId,
  );

  const recommendedWateringDays =
    selectedPlantType?.defaultIntervalDays ?? null;

  const trimmedPlantName = plantName.trim();
  const customDaysNumber = Number(customWateringDays);

  const isCustomDaysValid =
    customWateringDays !== '' &&
    Number.isInteger(customDaysNumber) &&
    customDaysNumber >= 1 &&
    customDaysNumber <= 365;

  const isWateringValid =
    wateringMode === 'automatic'
      ? recommendedWateringDays !== null
      : isCustomDaysValid;

  const isFormValid =
    trimmedPlantName.length > 0 &&
    selectedPlantType !== undefined &&
    isWateringValid;

  const handleSave = async () => {
    const plantId = Number(id);

    if (
      !Number.isInteger(plantId) ||
      !isFormValid ||
      !selectedPlantType ||
      isSubmitting
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await updatePlant(plantId, {
        plantTypeId: selectedPlantType.id,
        displayName: trimmedPlantName,
        wateringMode,
        customIntervalDays:
          wateringMode === 'custom'
            ? customDaysNumber
            : null,
      });

      await refreshPlants();

      router.replace(`/plant/${plantId}`);
    } catch (error) {
      console.error('식물 정보 수정 실패:', error);

      setSubmitError(
        '식물 정보를 수정하지 못했어요. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          식물 정보를 불러오고 있어요...
        </Text>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <Text style={styles.errorText}>{loadError}</Text>

        <Pressable
          onPress={() => router.back()}
          style={styles.errorBackButton}
        >
          <Text style={styles.errorBackButtonText}>
            돌아가기
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen
        options={{
          title: '식물 정보 수정',
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← 돌아가기</Text>
        </Pressable>

        <Text style={styles.eyebrow}>EDIT PLANT</Text>

        <Text style={styles.title}>식물 정보 수정</Text>

        <Text style={styles.description}>
          이름과 물주기 설정을 변경할 수 있어요.
        </Text>

        <PlantNameCard
          plantName={plantName}
          onChangePlantName={setPlantName}
        />

        <PlantTypeCard
          options={plantTypeOptions}
          selectedPlantTypeId={selectedPlantTypeId}
          onSelectPlantType={setSelectedPlantTypeId}
        />

        <WateringModeCard
          mode={wateringMode}
          recommendedDays={recommendedWateringDays}
          customDays={customWateringDays}
          onChangeMode={setWateringMode}
          onChangeCustomDays={setCustomWateringDays}
        />

        <Pressable
          disabled={!isFormValid || isSubmitting}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            (!isFormValid || isSubmitting) &&
              styles.saveButtonDisabled,
            pressed &&
              isFormValid &&
              !isSubmitting &&
              styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting
              ? '저장하고 있어요...'
              : '수정 내용 저장'}
          </Text>
        </Pressable>

        {submitError && (
          <Text style={styles.submitError}>
            {submitError}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6EF',
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6EF',
    paddingHorizontal: 22,
  },

  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingBottom: 48,
    paddingHorizontal: 22,
    paddingTop: 24,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
  },

  backText: {
    color: '#5C6B57',
    fontSize: 15,
    fontWeight: '700',
  },

  eyebrow: {
    color: '#7C8975',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 28,
  },

  title: {
    color: '#263125',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },

  description: {
    color: '#747B70',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },

  loadingText: {
    color: '#747B70',
    fontSize: 14,
    marginTop: 12,
  },

  errorText: {
    color: '#A34F42',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },

  errorBackButton: {
    backgroundColor: '#355E3B',
    borderRadius: 16,
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },

  errorBackButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  saveButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#355E3B',
    borderRadius: 18,
    marginTop: 24,
    paddingVertical: 16,
  },

  saveButtonDisabled: {
    opacity: 0.4,
  },

  saveButtonPressed: {
    opacity: 0.75,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  submitError: {
    backgroundColor: '#F8E8E4',
    borderRadius: 12,
    color: '#A34F42',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    padding: 14,
    textAlign: 'center',
  },
});