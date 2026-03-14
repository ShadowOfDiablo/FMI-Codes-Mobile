import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator, SafeAreaView } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { UserPlus, ChevronLeft } from 'lucide-react-native';
import { requestNotificationPermissionAndGetToken } from '../services/notificationService';
import EmailInput from '../components/EmailInput';

const rnBiometrics = new ReactNativeBiometrics();

const Register = ({ onRegisterSuccess, onGoBack }) => {
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
        return await requestNotificationPermissionAndGetToken();
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
            await rnBiometrics.createKeys();
            await requestNotificationPermission();
            onRegisterSuccess();
        } catch (e) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Left Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onGoBack}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <ChevronLeft size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <UserPlus size={60} color="#fff" />
          <Text style={styles.title}>Register Account</Text>
          <Text style={styles.subtitle}>Enter your email to get started</Text>
        </View>

        <View style={styles.form}>
          <EmailInput
              value={email}
              onChange={setEmail}
              error={error}
              placeholderTextColor="#666"
          />

          <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    left: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 15,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  button: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Register;