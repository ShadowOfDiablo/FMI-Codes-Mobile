import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Alert } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import ReactNativeBiometrics from 'react-native-biometrics';
import Register from './src/pages/register';

const rnBiometrics = new ReactNativeBiometrics();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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

      console.log('Approved signature:', signature);
      console.log('Challenge:', challenge);
      console.log('RequestId:', requestId);

      // Later send this to BE:
      // await fetch('https://your-api-url.com/api/auth/approve-login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     requestId,
      //     challenge,
      //     signature,
      //   }),
      // });

      Alert.alert('Success', 'Login approved');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Biometric approval failed');
    }
  };

  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    const unsubscribeForeground = onMessage(messaging, async remoteMessage => {
      Alert.alert(
        remoteMessage?.notification?.title || 'Login request',
        remoteMessage?.notification?.body || 'Approve login?',
        [
          {
            text: 'Decline',
            style: 'cancel',
          },
          {
            text: 'Approve',
            onPress: () => handleBiometricApproval(remoteMessage),
          },
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

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Register />
    </SafeAreaProvider>
  );
}

export default App;