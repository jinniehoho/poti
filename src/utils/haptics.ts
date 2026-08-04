import {
  requireOptionalNativeModule,
} from 'expo';
import { Platform, Vibration } from 'react-native';

type ExpoHapticsModule = {
  impactAsync: (style: 'light') => Promise<void>;
};

const nativeHaptics =
  Platform.OS === 'web'
    ? null
    : requireOptionalNativeModule<ExpoHapticsModule>(
        'ExpoHaptics',
      );

export async function playLightCareHaptic() {
  try {
    if (nativeHaptics?.impactAsync) {
      await nativeHaptics.impactAsync('light');
      return;
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate(10);
    }
  } catch {
    // Haptics are an enhancement and must never block a saved care action.
  }
}
