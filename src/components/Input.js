import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import useStore from '../context/store';

// Custom input component with theme support and error handling
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  touched,
  style = {},
  required = false,
  multiline = false,
  numberOfLines = 1,
  onBlur = () => {}
}) => {
  const darkMode = useStore(state => state.darkMode);
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label, 
          darkMode && styles.labelDark
        ]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={darkMode ? '#999' : '#aaa'}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          darkMode && styles.inputDark,
          error && touched && styles.inputError,
          multiline && styles.multiline
        ]}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        onBlur={onBlur}
      />
      
      {error && touched && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  labelDark: {
    color: '#f0f0f0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    width: '100%',
  },
  inputDark: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  inputError: {
    borderColor: '#e53935',
  },
  multiline: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
  },
  required: {
    color: '#e53935',
  },
});

export default Input; 