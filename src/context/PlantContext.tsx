import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getPlants } from '../services/plantService';
import type { Plant } from '../types/plant';

type PlantContextValue = {
  plants: Plant[];
  setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
  addPlant: (plant: Plant) => void;
  isLoadingPlants: boolean;
  plantsError: string | null;
};

const PlantContext = createContext<PlantContextValue | undefined>(
  undefined,
);

type PlantProviderProps = {
  children: ReactNode;
};

export function PlantProvider({
  children,
}: PlantProviderProps) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(true);
  const [plantsError, setPlantsError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadPlants() {
      try {
        setIsLoadingPlants(true);
        setPlantsError(null);

        const savedPlants = await getPlants();

        setPlants(savedPlants);
      } catch (error) {
        console.error('식물 목록 조회 실패:', error);

        setPlantsError(
          '식물 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
        );
      } finally {
        setIsLoadingPlants(false);
      }
    }

    loadPlants();
  }, []);

  const addPlant = (plant: Plant) => {
    setPlants((currentPlants) => [
      ...currentPlants,
      plant,
    ]);
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        setPlants,
        addPlant,
        isLoadingPlants,
        plantsError,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlants() {
  const context = useContext(PlantContext);

  if (!context) {
    throw new Error(
      'usePlants는 PlantProvider 안에서 사용해야 합니다.',
    );
  }

  return context;
}