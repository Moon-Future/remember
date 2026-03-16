import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFamilyStore } from '@/store';
import { getRelationLabel } from '@/types/family';
import type { Memory } from '@/types';

export default function FamilyMemberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedMember, fetchMemberDetail, deleteMember } = useFamilyStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      loadMember();
    }
  }, [id]);

  const loadMember = async () => {
    setLoading(true);
    try {
      await fetchMemberDetail(id);
    } catch (e) {
      console.error('Failed to load member', e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMember();
    setRefreshing(false);
  };

  const handleEdit = () => {
    router.push(`/family/add?id=${id}` as any);
  };

  const handleAddMemory = () => {
    router.push(`/memory/add?familyMemberId=${id}` as any);
  };

  const handleGoToTomb = () => {
    if (selectedMember?.tombId) {
      router.push(`/tomb/${selectedMember.tombId}` as any);
    }
  };

  const handleDelete = () => {
    Alert.alert('删除确认', '确定要删除这位家族成员吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMember(id);
            router.back();
          } catch (e) {
            Alert.alert('删除失败', e instanceof Error ? e.message : '请重试');
          }
        },
      },
    ]);
  };

  const renderMemoryItem = (memory: Memory) => (
    <TouchableOpacity
      key={memory.id}
      style={styles.memoryItem}
      onPress={() => router.push(`/memory/${memory.id}` as any)}
    >
      <View style={styles.memoryHeader}>
        <Text style={styles.memoryTitle}>{memory.title}</Text>
        <Text style={styles.memoryDate}>{memory.memoryDate}</Text>
      </View>
      {memory.content ? (
        <Text style={styles.memoryContent} numberOfLines={2}>
          {memory.content}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!selectedMember) {
    return (
      <View style={styles.loading}>
        <Text>成员不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{selectedMember.name.charAt(0)}</Text>
          </View>
        </View>
        <Text style={styles.name}>{selectedMember.name}</Text>
        <Text style={styles.relation}>{getRelationLabel(selectedMember.relation)}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>生卒年份</Text>
          <Text style={styles.infoValue}>
            {selectedMember.birthYear || '未知'}
            {selectedMember.deathYear ? ` - ${selectedMember.deathYear}` : ''}
          </Text>
        </View>
        {selectedMember.deathDate && (
          <View style={styles.infoRow}>
            <Ionicons name="flower-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>忌日</Text>
            <Text style={styles.infoValue}>{selectedMember.deathDate}</Text>
          </View>
        )}
        {selectedMember.bio && (
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>简介</Text>
            <Text style={styles.infoValue}>{selectedMember.bio}</Text>
          </View>
        )}
      </View>

      {selectedMember.tomb && (
        <TouchableOpacity style={styles.tombCard} onPress={handleGoToTomb}>
          <View style={styles.tombCardLeft}>
            <Ionicons name="location" size={24} color="#007AFF" />
            <View>
              <Text style={styles.tombTitle}>{selectedMember.tomb.name}</Text>
              <Text style={styles.tombAddress} numberOfLines={1}>
                {selectedMember.tomb.address}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>纪念记录</Text>
          <TouchableOpacity onPress={handleAddMemory}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        {selectedMember.memories?.length ? (
          selectedMember.memories.map(renderMemoryItem)
        ) : (
          <View style={styles.emptySection}>
            <Text style={styles.emptySectionText}>还没有纪念记录</Text>
          </View>
        )}
      </View>

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
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatar: {
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  relation: {
    fontSize: 16,
    color: '#666',
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
    alignItems: 'center',
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
  },
  tombCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  tombCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tombTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
  },
  tombAddress: {
    fontSize: 13,
    color: '#999',
    marginLeft: 12,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memoryItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memoryTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  memoryDate: {
    fontSize: 13,
    color: '#999',
  },
  memoryContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptySection: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptySectionText: {
    fontSize: 14,
    color: '#999',
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
