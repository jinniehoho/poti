import { Stack } from 'expo-router';

import { PlantProvider } from '../context/PlantContext';

export default function RootLayout() {
  return (
    <PlantProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PlantProvider>
  );
}