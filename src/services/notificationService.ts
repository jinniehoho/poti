import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  translate,
  type AppLanguage,
} from '../i18n/translations';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(
      'default',
      {
        name: 'Poti reminders',
        importance:
          Notifications.AndroidImportance.DEFAULT,
      },
    );
  }

  const { status } =
    await Notifications.requestPermissionsAsync();

  return status === 'granted';
}

export async function sendTestNotification(
  language: AppLanguage,
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌱 Poti',
      body: translate(language, 'notification.testBody'),
    },
    trigger: null,
  });
}
