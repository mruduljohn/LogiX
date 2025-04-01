import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import useStore from '../context/store';

const DashboardScreen = () => {
  const { boxes, fetchBoxes } = useStore();
  const [stats, setStats] = useState({
    totalBoxes: 0,
    totalWeight: 0,
    totalVolume: 0,
    clientDistribution: {},
    recentActivity: [],
  });

  useEffect(() => {
    fetchBoxes();
  }, []);

  useEffect(() => {
    if (boxes.length > 0) {
      calculateStats();
    }
  }, [boxes]);

  const calculateStats = () => {
    const newStats = {
      totalBoxes: boxes.length,
      totalWeight: boxes.reduce((sum, box) => sum + box.weight, 0),
      totalVolume: boxes.reduce((sum, box) => sum + (box.length * box.width * box.height), 0),
      clientDistribution: {},
      recentActivity: [],
    };

    // Calculate client distribution
    boxes.forEach(box => {
      newStats.clientDistribution[box.client_name] = 
        (newStats.clientDistribution[box.client_name] || 0) + 1;
    });

    // Sort recent activity
    newStats.recentActivity = [...boxes]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    setStats(newStats);
  };

  const clientData = {
    labels: Object.keys(stats.clientDistribution),
    datasets: [{
      data: Object.values(stats.clientDistribution),
    }],
  };

  const volumeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43, 50],
    }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Boxes</Text>
            <Text style={styles.summaryValue}>{stats.totalBoxes}</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Weight</Text>
            <Text style={styles.summaryValue}>{stats.totalWeight.toFixed(2)} kg</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Volume</Text>
            <Text style={styles.summaryValue}>{stats.totalVolume.toFixed(2)} cm³</Text>
          </View>
        </View>

        {/* Client Distribution Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Box Distribution by Client</Text>
          <PieChart
            data={clientData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(6, 113, 224, ${opacity})`,
            }}
            accessor="data"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Volume Trend Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Volume Trend</Text>
          <LineChart
            data={volumeData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(6, 113, 224, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.chartTitle}>Recent Activity</Text>
          {stats.recentActivity.map((box, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityClient}>{box.client_name}</Text>
                <Text style={styles.activityDate}>
                  {new Date(box.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.activityWeight}>{box.weight} kg</Text>
            </View>
          ))}
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0671e0',
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  activityContainer: {
    padding: 20,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityInfo: {
    flex: 1,
  },
  activityClient: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  activityWeight: {
    fontSize: 16,
    color: '#0671e0',
    fontWeight: 'bold',
  },
});

export default DashboardScreen; 