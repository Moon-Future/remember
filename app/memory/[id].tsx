import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFamilyStore } from '@/store';
import type { Memory } from '@/types';

const MEMORY_TYPE_LABELS: Record<string, string> = {
  qingming: '清明祭拜',
  deathday: '忌日',
  other: '其他',
};

export default function MemoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadMemory();
    }
  }, [id]);

  const loadMemory = async () => {
    setLoading(true);
    try {
      // TODO: 从 store 或 API 加载
      // const data = await memoryApi.detail(id);
      // setMemory(data);
    } catch (e) {
      console.error('Failed to load memory', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/memory/add?id=${id}` as any);
  };

  const handleDelete = () => {
    Alert.alert('删除确认', '确定要删除这条纪念记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            // await memoryApi.remove(id);
            router.back();
          } catch (e) {
            Alert.alert('删除失败', e instanceof Error ? e.message : '请重试');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!memory) {
    return (
      <View style={styles.loading}>
        <Text>记录不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{MEMORY_TYPE_LABELS[memory.type] || memory.type}</Text>
        </View>
        <Text style={styles.date}>{memory.memoryDate}</Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.title}>{memory.title}</Text>
        {memory.content && <Text style={styles.content}>{memory.content}</Text>}
      </View>

      {memory.photoUrls?.length > 0 && (
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>照片</Text>
          <View style={styles.photosGrid}>
            {memory.photoUrls.map((url, index) => (
              <View key={index} style={styles.photoItem}>
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="image" size={24} color="#ccc" />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

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
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  contentCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  content: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
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
