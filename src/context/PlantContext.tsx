import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useLanguage } from '../preferences/LanguageContext';
import {
  ensureStarterPlant,
  getPlants,
} from '../services/plantService';
import type { Plant } from '../types/plant';

type PlantContextValue = {
  plants: Plant[];
  setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
  addPlant: (plant: Plant) => void;
  refreshPlants: () => Promise<void>;
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
  const { language, t } = useLanguage();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(true);
  const [plantsError, setPlantsError] =
    useState<string | null>(null);

  const refreshPlants = useCallback(async () => {
    try {
      setIsLoadingPlants(true);
      setPlantsError(null);

      let savedPlants =
        await getPlants(language);

      if (savedPlants.length === 0) {
        await ensureStarterPlant(language);
        savedPlants = await getPlants(language);
      }

      setPlants(savedPlants);
    } catch (error) {
      console.error('Plant list query failed:', error);

      setPlantsError(t('home.plantsError'));
    } finally {
      setIsLoadingPlants(false);
    }
  }, [language, t]);

  useEffect(() => {
    void refreshPlants();
  }, [refreshPlants]);

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
        refreshPlants,
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
      'usePlants must be used inside PlantProvider.',
    );
  }

  return context;
}
