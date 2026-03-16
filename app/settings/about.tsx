import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const router = useRouter();

  const handleOpenPrivacy = () => {
    // TODO: 打开隐私政策页面
    Linking.openURL('https://example.com/privacy').catch(() => {});
  };

  const handleOpenTerms = () => {
    // TODO: 打开服务条款页面
    Linking.openURL('https://example.com/terms').catch(() => {});
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@example.com').catch(() => {});
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="leaf" size={48} color="#007AFF" />
        </View>
        <Text style={styles.appName}>不忘族迹</Text>
        <Text style={styles.version}>版本 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            不忘族迹是一款帮助您记录家族记忆、管理家族成员信息、记录先祖墓地位置的应用。
          </Text>
          <Text style={styles.descriptionText}>
            让我们一起，珍藏家族记忆，传承家族文化。
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>帮助与反馈</Text>
        <TouchableOpacity style={styles.item} onPress={handleOpenPrivacy}>
          <Text style={styles.itemTitle}>隐私政策</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={handleOpenTerms}>
          <Text style={styles.itemTitle}>服务条款</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={handleContact}>
          <Text style={styles.itemTitle}>联系我们</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 不忘族迹</Text>
        <Text style={styles.footerText}>保留所有权利</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 96,
    height: 96,
    backgroundColor: '#f0f8ff',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#999',
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
  description: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  descriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
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
  itemTitle: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
  },
});
