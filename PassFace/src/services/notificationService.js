import { Platform, PermissionsAndroid } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';

export const requestNotificationPermissionAndGetToken = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Notification permission denied');
    }
  }

  const app = getApp();
  const messagingInstance = getMessaging(app);
  const pushToken = await getToken(messagingInstance);

  if (!pushToken) {
    throw new Error('Failed to get push token');
  }

  return pushToken;
};