import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const EmailInput = ({ value, onChange, error }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChange}
        placeholder="Email Address"
        placeholderTextColor="#555"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    height: 56,
    backgroundColor: '#111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default EmailInput;