import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
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
import CustomDialog from './src/components/CustomDialog';

const rnBiometrics = new ReactNativeBiometrics();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isRegistered, setIsRegistered] = useState(null);

  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: null,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showDialog = (title, message, onConfirm, cancelText = null, onCancel = null) => {
    setDialog({
      visible: true,
      title,
      message,
      confirmText: 'Confirm',
      cancelText,
      onConfirm: () => {
        onConfirm?.();
        hideDialog();
      },
      onCancel: () => {
        onCancel?.();
        hideDialog();
      },
    });
  };

  const hideDialog = () => setDialog(prev => ({ ...prev, visible: false }));

  const handleBiometricApproval = async remoteMessage => {
    try {
      const data = remoteMessage?.data;
      console.log(data);
      const challenge = data?.challengeCode;
      const challengeId = data?.challengeId;

      if (!challenge) {
        showDialog('Error', 'Invalid challenge received');
        return;
      }

      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Approve login request',
        payload: challenge,
      });

      if (success && signature) {
        //TODO: call BE

        showDialog('Success', 'Login approved successfully');
      } else {
        showDialog('Cancelled', 'Biometric approval was cancelled');
      }
    } catch (e) {
      showDialog('Error', 'Biometric approval failed');
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
      showDialog(
        remoteMessage?.notification?.title || 'Login Request',
        remoteMessage?.notification?.body || 'Do you want to approve this login?',
        () => handleBiometricApproval(remoteMessage),
        'Decline'
      );
    });

    const unsubscribeOpened = onNotificationOpenedApp(messaging, remoteMessage => {
      showDialog(
        remoteMessage?.notification?.title || 'Login Request',
        remoteMessage?.notification?.body || 'Do you want to approve this login?',
        () => handleBiometricApproval(remoteMessage),
        'Decline'
      );
    });

    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        showDialog(
          remoteMessage?.notification?.title || 'Login Request',
          remoteMessage?.notification?.body || 'Do you want to approve this login?',
          () => handleBiometricApproval(remoteMessage),
          'Decline'
        );
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);

  if (isRegistered === null) return null;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />

      {isRegistered ? (
        <Landing onLogout={() => setIsRegistered(false)} />
      ) : (
        <Register
          onGoBack={() => setIsRegistered(true)}
          onRegisterSuccess={() =>
            showDialog(
              'Success',
              'Device registered successfully',
              () => setIsRegistered(true)
            )
          }
        />
      )}

      <CustomDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
      />
    </SafeAreaProvider>
  );
}

export default App;