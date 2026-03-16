import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTombStore, useFamilyStore } from '@/store';

export default function TombDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedTomb, fetchTombDetail, deleteTomb } = useTombStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadTomb();
    }
  }, [id]);

  const loadTomb = async () => {
    setLoading(true);
    try {
      await fetchTombDetail(id);
    } catch (e) {
      console.error('Failed to load tomb', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/tomb/add?id=${id}` as any);
  };

  const handleDelete = () => {
    Alert.alert('删除确认', '确定要删除这个墓地记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTomb(id);
            router.back();
          } catch (e) {
            Alert.alert('删除失败', e instanceof Error ? e.message : '请重试');
          }
        },
      },
    ]);
  };

  const handleNavigate = () => {
    if (!selectedTomb) return;

    const { latitude, longitude, name } = selectedTomb;
    const url = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${encodeURIComponent(name)}&coordinate=gaode&callnative=1`;
    Linking.openURL(url).catch(() => {
      Alert.alert('提示', '无法打开地图应用');
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!selectedTomb) {
    return (
      <View style={styles.loading}>
        <Text>墓地不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapPreview}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color="#ccc" />
          <Text style={styles.mapPlaceholderText}>地图预览</Text>
          <Text style={styles.coords}>
            {selectedTomb.latitude.toFixed(6)}, {selectedTomb.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.infoLabel}>名称</Text>
          <Text style={styles.infoValue}>{selectedTomb.name}</Text>
        </View>
        {selectedTomb.address && (
          <View style={styles.infoRow}>
            <Ionicons name="home-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>地址</Text>
            <Text style={styles.infoValue}>{selectedTomb.address}</Text>
          </View>
        )}
        {selectedTomb.familyMember && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>关联人物</Text>
            <Text style={styles.infoValue}>{selectedTomb.familyMember.name}</Text>
          </View>
        )}
        {selectedTomb.notes && (
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>备注</Text>
            <Text style={styles.infoValue}>{selectedTomb.notes}</Text>
          </View>
        )}
      </View>

      {selectedTomb.photoUrls?.length > 0 && (
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>照片</Text>
          <View style={styles.photosGrid}>
            {selectedTomb.photoUrls.map((url, index) => (
              <View key={index} style={styles.photoItem}>
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="image" size={24} color="#ccc" />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
        <Ionicons name="navigate" size={20} color="#fff" />
        <Text style={styles.navigateButtonText}>导航前往</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color="#007AFF" />
          <Text style={styles.editButtonText}>编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={styles.deleteButtonText}>删除</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPreview: {
    backgroundColor: '#fff',
    height: 240,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    gap: 8,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#999',
  },
  coords: {
    fontSize: 12,
    color: '#bbb',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  photosSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigateButton: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
  },
});
