import React, { useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import useStore from '../context/store';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { boxes, fetchBoxes, isLoading } = useStore();

  useEffect(() => {
    fetchBoxes();
  }, []);

  const renderBoxItem = ({ item }) => (
    <TouchableOpacity
      style={styles.boxItem}
      onPress={() => navigation.navigate('AddBox', { box: item })}
    >
      <View style={styles.boxInfo}>
        <Text style={styles.clientName}>{item.client_name}</Text>
        <Text style={styles.boxDetails}>
          {item.length}x{item.width}x{item.height} cm • {item.weight} kg
        </Text>
        <Text style={styles.barcodeId}>ID: {item.barcode_id}</Text>
      </View>
      <View style={styles.boxStatus}>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LogiX</Text>
        <View style={styles.headerButtons}>
          <Button
            title="Dashboard"
            onPress={() => navigation.navigate('Dashboard')}
            variant="outline"
            style={styles.headerButton}
          />
          <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
            variant="outline"
            style={styles.headerButton}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.actionButtons}>
          <Button
            title="Add Box"
            onPress={() => navigation.navigate('AddBox')}
            style={styles.actionButton}
          />
          <Button
            title="Scan Box"
            onPress={() => navigation.navigate('ScanBox')}
            style={styles.actionButton}
          />
          <Button
            title="Export"
            onPress={() => navigation.navigate('Export')}
            style={styles.actionButton}
          />
        </View>

        <FlatList
          data={boxes}
          renderItem={renderBoxItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshing={isLoading}
          onRefresh={fetchBoxes}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0671e0',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  list: {
    padding: 20,
  },
  boxItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  boxInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  boxDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  barcodeId: {
    fontSize: 12,
    color: '#999',
  },
  boxStatus: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen; 