import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import AddBoxScreen from '../screens/AddBoxScreen';
import ScanBoxScreen from '../screens/ScanBoxScreen';
import ExportScreen from '../screens/ExportScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import useStore from '../context/store';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, darkMode } = useStore();
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Home' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          },
          headerTintColor: darkMode ? '#fff' : '#000',
          headerTitleStyle: {
            color: darkMode ? '#fff' : '#000',
          },
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        
        {/* Main App Stack */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'LogiX' }}
        />
        <Stack.Screen 
          name="AddBox" 
          component={AddBoxScreen}
          options={{ title: 'Add New Box' }}
        />
        <Stack.Screen 
          name="ScanBox" 
          component={ScanBoxScreen}
          options={{ title: 'Scan Box' }}
        />
        <Stack.Screen 
          name="Export" 
          component={ExportScreen}
          options={{ title: 'Export Data' }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 