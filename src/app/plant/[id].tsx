import {
  router,
  Stack,
  useLocalSearchParams,
} from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PlantActionButtons from '../../components/plant/PlantActionButtons';
import PlantDetailHeader from '../../components/plant/PlantDetailHeader';
import PlantInfoCard from '../../components/plant/PlantInfoCard';
import { usePlants } from '../../context/PlantContext';
import {
  deletePlant,
  getPlantById,
} from '../../services/plantService';

type PlantDetail = {
  plant_id: number;
  display_name: string;
  plant_type_name: string;
  emoji: string;
  interval_days: number;
  last_watered_at: string | null;
  next_watering_at: string;
  watering_status: 'overdue' | 'due_today' | 'not_due';
  days_until_watering: number;
};

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshPlants } = usePlants();

  const [plant, setPlant] = useState<PlantDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadPlant() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const plantId = Number(id);

        if (!Number.isInteger(plantId)) {
          throw new Error('잘못된 식물 ID입니다.');
        }

        const result = await getPlantById(plantId);

        setPlant(result as PlantDetail);
      } catch (error) {
        console.error('식물 상세 조회 실패:', error);
        setLoadError('식물 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadPlant();
  }, [id]);

  const formatDate = (date: string | null) => {
    if (!date) {
      return '아직 없음';
    }

    return new Date(date).toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          식물 정보를 불러오고 있어요...
        </Text>
      </SafeAreaView>
    );
  }

  if (loadError || !plant) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          {loadError ?? '식물 정보를 찾을 수 없어요.'}
        </Text>
      </SafeAreaView>
    );
  }

  const statusLabel =
    plant.watering_status === 'due_today'
      ? '오늘 물 주는 날'
      : plant.watering_status === 'overdue'
        ? `${Math.abs(plant.days_until_watering)}일 지났어요`
        : `${plant.days_until_watering}일 후`;

  const handleEdit = () => {
    router.push(`/plant/edit/${plant.plant_id}`);
  };

  const handleDeleteRequest = () => {
    setDeleteError(null);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }

    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deletePlant(plant.plant_id);
      await refreshPlants();

      setShowDeleteConfirm(false);
      router.replace('/');
    } catch (error) {
      console.error('식물 삭제 실패:', error);

      setDeleteError(
        '식물을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen
        options={{
          title: '식물 정보',
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PlantDetailHeader
          emoji={plant.emoji}
          name={plant.display_name}
          typeName={plant.plant_type_name}
        />

        <PlantInfoCard
          intervalDays={plant.interval_days}
          statusLabel={statusLabel}
          lastWateredLabel={formatDate(plant.last_watered_at)}
          nextWateringLabel={formatDate(plant.next_watering_at)}
        />

        <PlantActionButtons
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showDeleteConfirm}
        onRequestClose={handleDeleteCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🪴</Text>

            <Text style={styles.modalTitle}>
              {plant.display_name}을(를) 삭제할까요?
            </Text>

            <Text style={styles.modalDescription}>
              삭제하면 홈 화면과 물주기 목록에서 더 이상
              표시되지 않아요.
            </Text>

            {deleteError && (
              <Text style={styles.deleteError}>
                {deleteError}
              </Text>
            )}

            <Pressable
              disabled={isDeleting}
              onPress={handleDeleteConfirm}
              style={({ pressed }) => [
                styles.confirmDeleteButton,
                isDeleting && styles.disabledButton,
                pressed &&
                  !isDeleting &&
                  styles.pressedButton,
              ]}
            >
              <Text style={styles.confirmDeleteButtonText}>
                {isDeleting
                  ? '삭제하고 있어요...'
                  : '삭제하기'}
              </Text>
            </Pressable>

            <Pressable
              disabled={isDeleting}
              onPress={handleDeleteCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed &&
                  !isDeleting &&
                  styles.pressedButton,
              ]}
            >
              <Text style={styles.cancelButtonText}>
                취소
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingTop: 36,
    paddingBottom: 48,
  },

  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7F2',
    paddingHorizontal: 22,
  },

  loadingText: {
    color: '#747B70',
    fontSize: 14,
    marginTop: 12,
  },

  errorText: {
    color: '#A34F42',
    fontSize: 15,
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 39, 25, 0.42)',
    paddingHorizontal: 22,
  },

  modalCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  modalEmoji: {
    fontSize: 44,
  },

  modalTitle: {
    color: '#263125',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
  },

  modalDescription: {
    color: '#747B70',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    textAlign: 'center',
  },

  deleteError: {
    width: '100%',
    backgroundColor: '#F8E8E4',
    borderRadius: 12,
    color: '#A34F42',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 18,
    padding: 13,
    textAlign: 'center',
  },

  confirmDeleteButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#A75549',
    borderRadius: 16,
    marginTop: 24,
    paddingVertical: 15,
  },

  confirmDeleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  cancelButton: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7DDD2',
    borderRadius: 16,
    marginTop: 12,
    paddingVertical: 15,
  },

  cancelButtonText: {
    color: '#5F695B',
    fontSize: 15,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.5,
  },

  pressedButton: {
    opacity: 0.72,
  },
});