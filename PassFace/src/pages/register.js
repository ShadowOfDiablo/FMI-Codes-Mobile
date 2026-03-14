import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { requestNotificationPermissionAndGetToken } from '../services/notificationService';
import EmailInput from '../components/EmailInput';

const rnBiometrics = new ReactNativeBiometrics();

const Register = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = emailValue => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(emailValue);
    };

    const requestNotificationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const result = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );

            if (result !== PermissionsAndroid.RESULTS.GRANTED) {
              throw new Error('Notification permission denied');
            }
        }

        const pushToken = await requestNotificationPermissionAndGetToken();

        if (!pushToken) {
            throw new Error('Failed to get push token');
        }

        return pushToken;
    };

    const handleRegister = async () => {
        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Invalid email address');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { publicKey } = await rnBiometrics.createKeys();

            const payload = `register:${email}:${Date.now()}`;

            const { success, signature } = await rnBiometrics.createSignature({
                promptMessage: 'Confirm registration',
                payload,
            });

            if (!success || !signature) {
                setError('Biometric confirmation failed or was cancelled');
                setLoading(false);
                return;
            }

            const pushToken = await requestNotificationPermission();

//      const response = await fetch('https://your-api-url.com/api/auth/register-device', {
//        method: 'POST',
//        headers: {
//          'Content-Type': 'application/json',
//        },
//        body: JSON.stringify({
//          email,
//          publicKey,
//          payload,
//          signature,
//          pushToken,
//        }),
//      });

//      if (!response.ok) {
//        throw new Error('Failed to register device');
//      }

            Alert.alert('Success', 'Device registered successfully');
        } catch (e) {
            console.error(e);
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <EmailInput value={email} onChange={setEmail} error={error} />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Register;