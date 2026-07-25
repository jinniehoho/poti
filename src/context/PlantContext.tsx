import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from 'react';

import type { Plant } from '../types/plant';

const initialPlants: Plant[] = [
  {
    id: 1,
    name: '초록이',
    typeName: '몬스테라',
    emoji: '🌿',
    status: 'not_due',
    statusText: '7일 후',
  },
  {
    id: 2,
    name: '튼튼이',
    typeName: '산세베리아',
    emoji: '🪴',
    status: 'due_today',
    statusText: '오늘',
  },
  {
    id: 3,
    name: '덩굴이',
    typeName: '스킨답서스',
    emoji: '🌱',
    status: 'not_due',
    statusText: '7일 후',
  },
];

type PlantContextValue = {
  plants: Plant[];
  setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
  addPlant: (plant: Plant) => void;
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
  const [plants, setPlants] = useState<Plant[]>(initialPlants);

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