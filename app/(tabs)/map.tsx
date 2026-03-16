import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTombStore, useAuthStore } from '@/store';
import { useLocation } from '@/hooks';

// 注意：实际项目中需要配置 react-native-amap3d
// 这里先做一个占位页面
export default function MapScreen() {
  const router = useRouter();
  const { markers, fetchMapMarkers } = useTombStore();
  const { location, getCurrentPosition } = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    setLoading(true);
    try {
      await fetchMapMarkers();
    } catch (e) {
      console.error('Failed to load markers', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTomb = () => {
    router.push('/tomb/add' as any);
  };

  const handleMyLocation = async () => {
    try {
      await getCurrentPosition();
    } catch (e) {
      Alert.alert('提示', '获取位置失败');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={80} color="#ddd" />
        <Text style={styles.placeholderText}>地图加载中...</Text>
        <Text style={styles.placeholderSubtext}>
          {markers.length} 个墓地位置
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleMyLocation}
        >
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddTomb}>
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.addButtonText}>记录墓地</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 120,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  addButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
