import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useReminderStore } from '@/store';
import type { UserSettings } from '@/types';

export default function ReminderSettingsScreen() {
  const router = useRouter();
  const { settings, fetchSettings, updateSettings, loading } = useReminderStore();
  const [localSettings, setLocalSettings] = useState<Partial<UserSettings>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const loadSettings = async () => {
    try {
      await fetchSettings();
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      Alert.alert('成功', '保存成功', [
        { text: '确定', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('失败', e instanceof Error ? e.message : '请重试');
    }
  };

  const toggleSetting = (key: keyof UserSettings) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!settings) {
    return (
      <View style={styles.loading}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>节日提醒</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="leaf-outline" size={22} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>清明节提醒</Text>
              <Text style={styles.settingDesc}>清明节前3天提醒</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.switch}
            onPress={() => toggleSetting('qingmingReminder')}
          >
            <View style={[styles.switchThumb, localSettings.qingmingReminder && styles.switchThumbOn]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>忌日提醒</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="calendar-outline" size={22} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>忌日提醒</Text>
              <Text style={styles.settingDesc}>忌日前3天提醒</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.switch}
            onPress={() => toggleSetting('deathdayReminder')}
          >
            <View style={[styles.switchThumb, localSettings.deathdayReminder && styles.switchThumbOn]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>提醒时间</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="time-outline" size={22} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>提醒时间</Text>
              <Text style={styles.settingDesc}>每天 09:00</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>
          {loading ? '保存中...' : '保存设置'}
        </Text>
      </TouchableOpacity>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#999',
  },
  switch: {
    width: 52,
    height: 32,
    backgroundColor: '#ddd',
    borderRadius: 16,
    padding: 2,
  },
  switchThumb: {
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 14,
    transform: [{ translateX: 0 }],
  },
  switchThumbOn: {
    backgroundColor: '#007AFF',
    transform: [{ translateX: 20 }],
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
