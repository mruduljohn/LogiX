import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Button from '../components/Button';
import useStore from '../context/store';

const ScanBoxScreen = () => {
  const navigation = useNavigation();
  const { addNewBox } = useStore();
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    goods_description: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    barcode_id: '',
  });
  
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    
    getBarCodeScannerPermissions();
  }, []);
  
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setFormData(prev => ({ ...prev, barcode_id: data }));
    
    // Navigate to AddBox screen with the scanned barcode
    navigation.navigate('AddBox', { 
      initialBarcode: data,
      onSave: async (boxData) => {
        const result = await addNewBox(boxData);
        if (result.success) {
          navigation.goBack();
        }
      }
    });
  };
  
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>No access to camera</Text>
          <Text style={styles.subtext}>
            Please enable camera access in your device settings to scan barcodes.
          </Text>
          <Button
            title="Go to Settings"
            onPress={() => {
              // Open device settings
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scanner}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
        
        {scanned && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              Barcode scanned! Redirecting to form...
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.controls}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanner: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
  controls: {
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 12,
  },
});

export default ScanBoxScreen; 