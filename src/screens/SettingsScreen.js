import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import useStore from '../context/store';
import { supabase } from '../services/supabase';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user, isDarkMode, toggleDarkMode, signOut } = useStore();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Settings
        </Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Profile
          </Text>
          <View style={styles.profileInfo}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>
              Name
            </Text>
            <Text style={[styles.value, isDarkMode && styles.darkText]}>
              {user?.user_metadata?.name || 'Not set'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>
              Email
            </Text>
            <Text style={[styles.value, isDarkMode && styles.darkText]}>
              {user?.email}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>
              Role
            </Text>
            <Text style={[styles.value, isDarkMode && styles.darkText]}>
              {user?.user_metadata?.role || 'worker'}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Appearance
          </Text>
          <View style={styles.setting}>
            <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#0671e0' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          style={styles.signOutButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0671e0',
    marginBottom: 20,
  },
  darkText: {
    color: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    marginTop: 30,
  },
});

export default SettingsScreen; 