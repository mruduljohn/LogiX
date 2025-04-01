import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import useStore from '../context/store';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ExportScreen = () => {
  const navigation = useNavigation();
  const { boxes, exportData, isLoading } = useStore();
  
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!recipientEmail) {
      newErrors.recipientEmail = 'Recipient email is required';
    } else if (!/\S+@\S+\.\S+/.test(recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email';
    }
    
    if (!message) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const generateExcelFile = async () => {
    try {
      // Prepare data for Excel
      const data = boxes.map(box => ({
        'Barcode ID': box.barcode_id,
        'Client Name': box.client_name,
        'Goods Description': box.goods_description,
        'Length (cm)': box.length,
        'Width (cm)': box.width,
        'Height (cm)': box.height,
        'Weight (kg)': box.weight,
        'Created At': new Date(box.created_at).toLocaleString(),
      }));
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Boxes');
      
      // Generate Excel file
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      
      // Save file to local storage
      const fileName = `LogiX_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      return filePath;
    } catch (error) {
      console.error('Error generating Excel file:', error);
      throw error;
    }
  };
  
  const handleExport = async () => {
    if (!validateForm()) return;
    
    try {
      const filePath = await generateExcelFile();
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Export Box Data',
        });
      }
      
      // Send to recipient
      const result = await exportData({
        recipientEmail,
        message,
        filePath,
      });
      
      if (result.success) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Failed to export data. Please try again.',
      }));
    }
  };
  
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Export Box Data</Text>
        <Text style={styles.subtitle}>
          Generate and send an Excel file of all box data
        </Text>
        
        <View style={styles.form}>
          <Input
            label="Recipient Email"
            value={recipientEmail}
            onChangeText={setRecipientEmail}
            placeholder="Enter recipient's email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.recipientEmail}
            touched={touched.recipientEmail}
            onBlur={() => handleBlur('recipientEmail')}
            required
          />
          
          <Input
            label="Message"
            value={message}
            onChangeText={setMessage}
            placeholder="Enter message for the recipient"
            multiline
            numberOfLines={4}
            error={errors.message}
            touched={touched.message}
            onBlur={() => handleBlur('message')}
            required
          />
          
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}
          
          <View style={styles.stats}>
            <Text style={styles.statsText}>
              Total Boxes: {boxes.length}
            </Text>
            <Text style={styles.statsText}>
              Total Weight: {boxes.reduce((sum, box) => sum + box.weight, 0).toFixed(2)} kg
            </Text>
          </View>
          
          <Button
            title="Generate & Send Excel"
            onPress={handleExport}
            loading={isLoading}
            fullWidth
            style={styles.exportButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0671e0',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  form: {
    padding: 20,
  },
  stats: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
  },
  statsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  exportButton: {
    marginTop: 20,
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default ExportScreen; 