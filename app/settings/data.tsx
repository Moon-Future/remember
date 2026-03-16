import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store';

export default function DataManagementScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleExportData = () => {
    Alert.alert('导出数据', '确定要导出所有数据吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '导出',
        onPress: async () => {
          setLoading(true);
          try {
            // TODO: 实现数据导出
            Alert.alert('成功', '数据导出成功');
          } catch (e) {
            Alert.alert('失败', e instanceof Error ? e.message : '请重试');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleImportData = () => {
    Alert.alert('导入数据', '导入数据将覆盖现有数据，确定要继续吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '导入',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            // TODO: 实现数据导入
            Alert.alert('成功', '数据导入成功');
          } catch (e) {
            Alert.alert('失败', e instanceof Error ? e.message : '请重试');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      '删除所有数据',
      '此操作不可恢复，确定要删除所有数据吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // TODO: 实现数据删除
              Alert.alert('成功', '数据已删除');
            } catch (e) {
              Alert.alert('失败', e instanceof Error ? e.message : '请重试');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>数据操作</Text>
        <TouchableOpacity style={styles.item} onPress={handleExportData} disabled={loading}>
          <View style={styles.itemLeft}>
            <Ionicons name="download-outline" size={22} color="#007AFF" />
            <Text style={styles.itemTitle}>导出数据</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={handleImportData} disabled={loading}>
          <View style={styles.itemLeft}>
            <Ionicons name="upload-outline" size={22} color="#007AFF" />
            <Text style={styles.itemTitle}>导入数据</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>危险操作</Text>
        <TouchableOpacity style={styles.item} onPress={handleDeleteAllData} disabled={loading}>
          <View style={styles.itemLeft}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            <Text style={[styles.itemTitle, { color: '#FF3B30' }]}>删除所有数据</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Ionicons name="information-circle-outline" size={20} color="#999" />
        <Text style={styles.infoText}>
          数据存储在本地设备和云端服务器中，您可以随时导出备份。
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
    lineHeight: 18,
  },
});
