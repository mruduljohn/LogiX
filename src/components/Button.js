import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useStore from '../context/store';

// Custom button component with support for loading state and theme
const Button = ({ 
  title, 
  onPress, 
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'outline'
  size = 'medium', // 'small', 'medium', 'large'
  fullWidth = false,
  style = {},
  textStyle = {}
}) => {
  const darkMode = useStore(state => state.darkMode);
  
  // Determine styles based on props and theme
  const getButtonStyles = () => {
    const baseStyle = [styles.button];
    
    // Variant
    if (variant === 'primary') {
      baseStyle.push(darkMode ? styles.primaryDark : styles.primary);
    } else if (variant === 'secondary') {
      baseStyle.push(darkMode ? styles.secondaryDark : styles.secondary);
    } else if (variant === 'outline') {
      baseStyle.push(darkMode ? styles.outlineDark : styles.outline);
    }
    
    // Size
    if (size === 'small') {
      baseStyle.push(styles.smallButton);
    } else if (size === 'large') {
      baseStyle.push(styles.largeButton);
    }
    
    // Width
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    // Disabled
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };
  
  // Determine text styles based on props and theme
  const getTextStyles = () => {
    const baseStyle = [styles.text];
    
    // Variant
    if (variant === 'primary') {
      baseStyle.push(styles.textLight);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.textDark);
    } else if (variant === 'outline') {
      baseStyle.push(darkMode ? styles.textLight : styles.textDark);
    }
    
    // Size
    if (size === 'small') {
      baseStyle.push(styles.smallText);
    } else if (size === 'large') {
      baseStyle.push(styles.largeText);
    }
    
    // Disabled
    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };
  
  return (
    <TouchableOpacity
      style={[...getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#fff' : '#0671e0'} 
        />
      ) : (
        <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0671e0',
    minWidth: 100,
  },
  
  // Variants
  primary: {
    backgroundColor: '#0671e0',
  },
  primaryDark: {
    backgroundColor: '#1a90ff',
  },
  secondary: {
    backgroundColor: '#f0f0f0',
  },
  secondaryDark: {
    backgroundColor: '#333',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0671e0',
  },
  outlineDark: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1a90ff',
  },
  
  // Sizes
  smallButton: {
    padding: 8,
    minWidth: 80,
  },
  largeButton: {
    padding: 16,
    minWidth: 120,
  },
  
  // Width
  fullWidth: {
    width: '100%',
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textLight: {
    color: '#fff',
  },
  textDark: {
    color: '#333',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button; 