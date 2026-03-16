import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTombStore, useFamilyStore } from '@/store';
import { useLocation, useCamera } from '@/hooks';
import type { CreateTombRequest } from '@/types';

export default function AddTombScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { selectedTomb, createTomb, updateTomb, fetchTombDetail } = useTombStore();
  const { members, fetchMembers } = useFamilyStore();
  const { location, getCurrentPosition } = useLocation();
  const { takePhoto, pickImage } = useCamera();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState('');
  const [familyMemberId, setFamilyMemberId] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    loadMembers();
    if (id) {
      setIsEdit(true);
      loadTomb(id);
    } else {
      getLocation();
    }
  }, [id]);

  const loadMembers = async () => {
    try {
      await fetchMembers({ onlyDeceased: true });
    } catch (e) {
      console.error('Failed to load members', e);
    }
  };

  const loadTomb = async (tombId: string) => {
    setLoading(true);
    try {
      const tomb = await fetchTombDetail(tombId);
      if (tomb) {
        setName(tomb.name);
        setFamilyMemberId(tomb.familyMemberId || '');
        setLongitude(tomb.longitude.toString());
        setLatitude(tomb.latitude.toString());
        setAddress(tomb.address || '');
        setNotes(tomb.notes || '');
        setPhotoUrls(tomb.photoUrls || []);
      }
    } catch (e) {
      console.error('Failed to load tomb', e);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      const loc = await getCurrentPosition();
      setLatitude(loc.latitude.toString());
      setLongitude(loc.longitude.toString());
    } catch (e) {
      console.error('Failed to get location', e);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await takePhoto();
      setPhotoUrls((prev) => [...prev, photo.uri]);
    } catch (e) {
      if (e instanceof Error && e.message !== '取消拍照') {
        Alert.alert('提示', e.message);
      }
    }
  };

  const handlePickImage = async () => {
    try {
      const photos = await pickImage({ allowsMultipleSelection: true, selectionLimit: 9 });
      if (Array.isArray(photos)) {
        setPhotoUrls((prev) => [...prev, ...photos.map((p) => p.uri)]);
      }
    } catch (e) {
      if (e instanceof Error && e.message !== '取消选择') {
        Alert.alert('提示', e.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入墓地名称');
      return;
    }
    if (!latitude || !longitude) {
      Alert.alert('提示', '请获取位置信息');
      return;
    }

    setLoading(true);
    try {
      const data: CreateTombRequest = {
        name: name.trim(),
        familyMemberId: familyMemberId || undefined,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || undefined,
        notes: notes || undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      };

      if (isEdit && id) {
        await updateTomb(id, data);
      } else {
        await createTomb(data);
      }

      Alert.alert('成功', isEdit ? '更新成功' : '创建成功', [
        { text: '确定', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('失败', e instanceof Error ? e.message : '请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.locationSection}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={32} color="#ccc" />
            <Text style={styles.mapText}>点击获取位置</Text>
            {latitude && longitude && (
              <Text style={styles.coords}>{latitude}, {longitude}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
            <Ionicons name="locate" size={20} color="#fff" />
            <Text style={styles.locationButtonText}>获取当前位置</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>墓地名称 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例如: 爷爷之墓"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>关联逝者 (可选)</Text>
          <TextInput
            style={styles.input}
            placeholder="选择关联的家族成员"
            value={familyMemberId}
            onChangeText={setFamilyMemberId}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>经度</Text>
            <TextInput
              style={styles.input}
              placeholder="经度"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>纬度</Text>
            <TextInput
              style={styles.input}
              placeholder="纬度"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>详细地址</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入详细地址"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>备注</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="例如: 墓碑朝东，第三排"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.photosSection}>
          <Text style={styles.label}>照片</Text>
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.photoAction} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.photoActionText}>拍照</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoAction} onPress={handlePickImage}>
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={styles.photoActionText}>相册</Text>
            </TouchableOpacity>
          </View>
          {photoUrls.length > 0 && (
            <View style={styles.photosGrid}>
              {photoUrls.map((url, index) => (
                <View key={index} style={styles.photoItem}>
                  <View style={styles.photoThumbnail}>
                    <Ionicons name="image" size={20} color="#ccc" />
                  </View>
                  <TouchableOpacity
                    style={styles.photoRemove}
                    onPress={() => setPhotoUrls((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close-circle" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? '保存中...' : isEdit ? '更新' : '记录墓地'}
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
  form: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  locationSection: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  mapText: {
    fontSize: 14,
    color: '#999',
  },
  coords: {
    fontSize: 12,
    color: '#666',
  },
  locationButton: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  photosSection: {
    marginTop: 8,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  photoAction: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  photoActionText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  submitButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
