import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScanFace } from 'lucide-react-native';

const Landing = () => {
  return (
    <View style={styles.container}>
      <ScanFace size={80} color="#fff" />
      <Text style={styles.title}>PassFace</Text>
      <Text style={styles.text}>Waiting for login requests</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
});

export default Landing;