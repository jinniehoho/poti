import PlantNameCard from '../components/PlantNameCard';
import PlantTypeCard, {
  type PlantTypeOption,
} from '../components/PlantTypeCard';

import WateringModeCard, {
  type WateringMode,
} from '../components/WateringModeCard';

import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RegisterPlantButton from '../components/RegisterPlantButton';
import { usePlants } from '../context/PlantContext';
import { getPlantTypes } from '../services/plantTypeService';
import { createPlant } from '../services/plantService';


export default function AddPlantScreen() {
    const { addPlant } = usePlants();

    const [plantTypeOptions, setPlantTypeOptions] =
  useState<PlantTypeOption[]>([]);

const [isSubmitting, setIsSubmitting] = useState(false);

const [submitError, setSubmitError] =
  useState<string | null>(null);
  
const [isLoadingPlantTypes, setIsLoadingPlantTypes] =
  useState(true);

const [plantTypesError, setPlantTypesError] =
  useState<string | null>(null);

  const [plantName, setPlantName] = useState('');

    const [selectedPlantTypeId, setSelectedPlantTypeId] =
    useState<number | null>(null);

      const [wateringMode, setWateringMode] =
    useState<WateringMode>('automatic');

  const [customWateringDays, setCustomWateringDays] = useState('');

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

  const finalWateringDays =
  wateringMode === 'automatic'
    ? recommendedWateringDays
    : customDaysNumber;

    const handleRegisterPlant = async () => {
  if (
    !isFormValid ||
    !selectedPlantType ||
    finalWateringDays === null ||
    isSubmitting
  ) {
    return;
  }

  try {
    setIsSubmitting(true);
    setSubmitError(null);

    const savedPlant = await createPlant({
      plantTypeId: selectedPlantType.id,
      displayName: trimmedPlantName,
      wateringMode,
      customIntervalDays:
        wateringMode === 'custom'
          ? finalWateringDays
          : null,
    });

    const newPlant = {
      id: savedPlant.id,
      name: trimmedPlantName,
      typeName: selectedPlantType.name,
      emoji: selectedPlantType.emoji,
      status: 'not_due' as const,
      statusText: `${finalWateringDays}일 후`,
    };

    addPlant(newPlant);
    router.back();
  } catch (error) {
    console.error('식물 등록 실패:', error);

    setSubmitError(
      '식물을 등록하지 못했어요. 잠시 후 다시 시도해주세요.',
    );
  } finally {
    setIsSubmitting(false);
  }
};

useEffect(() => {
  async function loadPlantTypes() {
    try {
      setIsLoadingPlantTypes(true);
      setPlantTypesError(null);

      const data = await getPlantTypes();

      setPlantTypeOptions(data);
    } catch (error) {
      console.error('식물 종류 조회 실패:', error);
      setPlantTypesError(
        '식물 종류를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsLoadingPlantTypes(false);
    }
  }

  loadPlantTypes();
}, []);

  return (
    <SafeAreaView style={styles.screen}>
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

        <Text style={styles.eyebrow}>NEW PLANT</Text>
        <Text style={styles.title}>식물 등록</Text>

        <Text style={styles.description}>
          키우고 있는 식물의 정보를 등록해보세요.
        </Text>

        <PlantNameCard
  plantName={plantName}
  onChangePlantName={setPlantName}
/> 

{isLoadingPlantTypes ? (
  <Text style={styles.loadingText}>
    식물 종류를 불러오고 있어요...
  </Text>
) : plantTypesError ? (
  <Text style={styles.errorText}>
    {plantTypesError}
  </Text>
) : (
  <PlantTypeCard
    options={plantTypeOptions}
    selectedPlantTypeId={selectedPlantTypeId}
    onSelectPlantType={setSelectedPlantTypeId}
  />
)}

<WateringModeCard
  mode={wateringMode}
  recommendedDays={recommendedWateringDays}
  customDays={customWateringDays}
  onChangeMode={setWateringMode}
  onChangeCustomDays={setCustomWateringDays}
/>
<RegisterPlantButton
  disabled={!isFormValid || isSubmitting}
  onPress={handleRegisterPlant}
/>

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
  marginTop: 24,
  textAlign: 'center',
},

errorText: {
  backgroundColor: '#F8E8E4',
  borderRadius: 12,
  color: '#A34F42',
  fontSize: 14,
  lineHeight: 21,
  marginTop: 20,
  padding: 16,
  textAlign: 'center',
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