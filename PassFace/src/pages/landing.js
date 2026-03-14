import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScanFace } from 'lucide-react-native';

const Landing = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScanFace size={80} color="#fff" />
        <Text style={styles.title}>PassFace</Text>
        <Text style={styles.text}>Waiting for login requests</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onLogout}
        >
          <Text style={styles.buttonText}>Register New Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    marginTop: 16,
    fontWeight: '600',
  },
  text: {
    color: '#aaa',
    marginTop: 6,
  },
  footer: {
    width: '100%',
  },
  button: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Landing;