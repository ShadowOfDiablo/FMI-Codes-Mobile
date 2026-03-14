import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme, Alert } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactNativeBiometrics from 'react-native-biometrics';

import Register from './src/pages/register';
import Landing from './src/pages/landing';

const rnBiometrics = new ReactNativeBiometrics();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isRegistered, setIsRegistered] = useState(null);

  const handleBiometricApproval = async remoteMessage => {
    try {
      const challenge =
        remoteMessage?.data?.challenge ||
        `login:${Date.now()}`;

      const requestId = remoteMessage?.data?.requestId || null;

      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Approve login',
        payload: challenge,
      });

      if (!success || !signature) {
        Alert.alert('Cancelled', 'Biometric approval was cancelled');
        return;
      }

      Alert.alert('Success', 'Login approved');
    } catch (e) {
      Alert.alert('Error', 'Biometric approval failed');
    }
  };

  useEffect(() => {
    const checkRegistration = async () => {
      const { keysExist } = await rnBiometrics.biometricKeysExist();
      setIsRegistered(keysExist);
    };

    checkRegistration();

    const app = getApp();
    const messaging = getMessaging(app);

    const unsubscribeForeground = onMessage(messaging, async remoteMessage => {
      Alert.alert(
        remoteMessage?.notification?.title || 'Login request',
        remoteMessage?.notification?.body || 'Approve login?',
        [
          { text: 'Decline', style: 'cancel' },
          { text: 'Approve', onPress: () => handleBiometricApproval(remoteMessage) },
        ],
      );
    });

    const unsubscribeOpened = onNotificationOpenedApp(messaging, remoteMessage => {
      handleBiometricApproval(remoteMessage);
    });

    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        handleBiometricApproval(remoteMessage);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);

  if (isRegistered === null) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isRegistered ? <Landing /> : <Register />}
    </SafeAreaProvider>
  );
}

export default App;