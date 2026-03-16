import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, SectionList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useReminderStore } from '@/store';
import type { Reminder } from '@/types';
import { formatDate, isDateInPast, getDaysUntil } from '@/utils/date';

const REMINDER_TYPE_LABELS: Record<string, string> = {
  qingming: '清明节',
  deathday: '忌日',
  custom: '自定义',
};

const REMINDER_TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  qingming: 'leaf',
  deathday: 'calendar',
  custom: 'notifications',
};

const REMINDER_TYPE_COLORS: Record<string, string> = {
  qingming: '#34C759',
  deathday: '#FF9500',
  custom: '#007AFF',
};

export default function ReminderListScreen() {
  const router = useRouter();
  const { reminders, fetchReminders, deleteReminder, loading } = useReminderStore();
  const [sections, setSections] = useState<{ title: string; data: Reminder[] }[]>([]);

  useEffect(() => {
    loadReminders();
  }, []);

  useEffect(() => {
    organizeReminders();
  }, [reminders]);

  const loadReminders = async () => {
    try {
      await fetchReminders();
    } catch (e) {
      console.error('Failed to load reminders', e);
    }
  };

  const organizeReminders = () => {
    const upcoming: Reminder[] = [];
    const past: Reminder[] = [];

    reminders.forEach((reminder) => {
      if (isDateInPast(reminder.reminderDate)) {
        past.push(reminder);
      } else {
        upcoming.push(reminder);
      }
    });

    // 按日期排序
    upcoming.sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime());
    past.sort((a, b) => new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime());

    const newSections: { title: string; data: Reminder[] }[] = [];
    if (upcoming.length > 0) {
      newSections.push({ title: '即将到来', data: upcoming });
    }
    if (past.length > 0) {
      newSections.push({ title: '已过期', data: past });
    }

    setSections(newSections);
  };

  const handleDelete = (reminder: Reminder) => {
    Alert.alert('删除确认', '确定要删除这个提醒吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReminder(reminder.id);
          } catch (e) {
            Alert.alert('删除失败', e instanceof Error ? e.message : '请重试');
          }
        },
      },
    ]);
  };

  const renderReminderItem = ({ item }: { item: Reminder }) => {
    const daysUntil = getDaysUntil(item.reminderDate);
    const isUpcoming = !isDateInPast(item.reminderDate);

    return (
      <View style={styles.reminderItem}>
        <View style={styles.reminderLeft}>
          <View
            style={[
              styles.reminderIcon,
              { backgroundColor: `${REMINDER_TYPE_COLORS[item.type]}20` },
            ]}
          >
            <Ionicons
              name={REMINDER_TYPE_ICONS[item.type]}
              size={24}
              color={REMINDER_TYPE_COLORS[item.type]}
            />
          </View>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>{item.title}</Text>
            <Text style={styles.reminderType}>{REMINDER_TYPE_LABELS[item.type]}</Text>
          </View>
        </View>
        <View style={styles.reminderRight}>
          <Text style={styles.reminderDate}>{formatDate(item.reminderDate)}</Text>
          {isUpcoming && daysUntil !== null && (
            <View style={styles.daysBadge}>
              <Text style={styles.daysText}>
                {daysUntil === 0 ? '今天' : `${daysUntil}天`}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  if (loading && reminders.length === 0) {
    return (
      <View style={styles.loading}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>暂无提醒</Text>
          <Text style={styles.emptyDesc}>添加家族成员后会自动创建忌日提醒</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderReminderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  list: {
    paddingVertical: 8,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  reminderItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  reminderType: {
    fontSize: 13,
    color: '#999',
  },
  reminderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  reminderDate: {
    fontSize: 14,
    color: '#666',
  },
  daysBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  daysText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
});
