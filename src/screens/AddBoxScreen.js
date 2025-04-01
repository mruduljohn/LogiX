import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import useStore from '../context/store';

const AddBoxScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addNewBox, loadingBoxes } = useStore();
  
  const existingBox = route.params?.box;
  
  const [formData, setFormData] = useState({
    client_name: '',
    goods_description: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    barcode_id: '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  useEffect(() => {
    if (existingBox) {
      setFormData({
        client_name: existingBox.client_name,
        goods_description: existingBox.goods_description,
        length: existingBox.length.toString(),
        width: existingBox.width.toString(),
        height: existingBox.height.toString(),
        weight: existingBox.weight.toString(),
        barcode_id: existingBox.barcode_id,
      });
    }
  }, [existingBox]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.client_name) {
      newErrors.client_name = 'Client name is required';
    }
    
    if (!formData.goods_description) {
      newErrors.goods_description = 'Goods description is required';
    }
    
    if (!formData.length) {
      newErrors.length = 'Length is required';
    } else if (isNaN(formData.length) || parseFloat(formData.length) <= 0) {
      newErrors.length = 'Please enter a valid length';
    }
    
    if (!formData.width) {
      newErrors.width = 'Width is required';
    } else if (isNaN(formData.width) || parseFloat(formData.width) <= 0) {
      newErrors.width = 'Please enter a valid width';
    }
    
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (isNaN(formData.height) || parseFloat(formData.height) <= 0) {
      newErrors.height = 'Please enter a valid height';
    }
    
    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(formData.weight) || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    
    if (!formData.barcode_id) {
      newErrors.barcode_id = 'Barcode ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const boxData = {
      ...formData,
      length: parseFloat(formData.length),
      width: parseFloat(formData.width),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
    };
    
    const result = await addNewBox(boxData);
    if (result.success) {
      navigation.goBack();
    }
  };
  
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>
          {existingBox ? 'Edit Box' : 'Add New Box'}
        </Text>
        
        <View style={styles.form}>
          <Input
            label="Client Name"
            value={formData.client_name}
            onChangeText={(value) => handleChange('client_name', value)}
            placeholder="Enter client name"
            error={errors.client_name}
            touched={touched.client_name}
            onBlur={() => handleBlur('client_name')}
            required
          />
          
          <Input
            label="Goods Description"
            value={formData.goods_description}
            onChangeText={(value) => handleChange('goods_description', value)}
            placeholder="Enter goods description"
            multiline
            numberOfLines={3}
            error={errors.goods_description}
            touched={touched.goods_description}
            onBlur={() => handleBlur('goods_description')}
            required
          />
          
          <View style={styles.dimensions}>
            <Input
              label="Length (cm)"
              value={formData.length}
              onChangeText={(value) => handleChange('length', value)}
              placeholder="Enter length"
              keyboardType="numeric"
              error={errors.length}
              touched={touched.length}
              onBlur={() => handleBlur('length')}
              required
              style={styles.dimensionInput}
            />
            
            <Input
              label="Width (cm)"
              value={formData.width}
              onChangeText={(value) => handleChange('width', value)}
              placeholder="Enter width"
              keyboardType="numeric"
              error={errors.width}
              touched={touched.width}
              onBlur={() => handleBlur('width')}
              required
              style={styles.dimensionInput}
            />
            
            <Input
              label="Height (cm)"
              value={formData.height}
              onChangeText={(value) => handleChange('height', value)}
              placeholder="Enter height"
              keyboardType="numeric"
              error={errors.height}
              touched={touched.height}
              onBlur={() => handleBlur('height')}
              required
              style={styles.dimensionInput}
            />
          </View>
          
          <Input
            label="Weight (kg)"
            value={formData.weight}
            onChangeText={(value) => handleChange('weight', value)}
            placeholder="Enter weight"
            keyboardType="numeric"
            error={errors.weight}
            touched={touched.weight}
            onBlur={() => handleBlur('weight')}
            required
          />
          
          <Input
            label="Barcode ID"
            value={formData.barcode_id}
            onChangeText={(value) => handleChange('barcode_id', value)}
            placeholder="Enter barcode ID"
            error={errors.barcode_id}
            touched={touched.barcode_id}
            onBlur={() => handleBlur('barcode_id')}
            required
          />
          
          <Button
            title={existingBox ? 'Update Box' : 'Add Box'}
            onPress={handleSubmit}
            loading={loadingBoxes}
            fullWidth
            style={styles.submitButton}
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
  form: {
    padding: 20,
  },
  dimensions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dimensionInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default AddBoxScreen; 