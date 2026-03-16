import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFamilyStore } from '@/store';
import { useCamera } from '@/hooks';
import type { CreateMemoryRequest } from '@/types';

const MEMORY_TYPE_OPTIONS = [
  { value: 'qingming', label: '清明祭拜' },
  { value: 'deathday', label: '忌日' },
  { value: 'other', label: '其他' },
] as const;

export default function AddMemoryScreen() {
  const { id, familyMemberId } = useLocalSearchParams<{ id?: string; familyMemberId?: string }>();
  const router = useRouter();
  const { members, fetchMembers } = useFamilyStore();
  const { takePhoto, pickImage } = useCamera();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [type, setType] = useState<string>('other');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [memoryDate, setMemoryDate] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(familyMemberId || '');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  useEffect(() => {
    loadMembers();
    if (id) {
      setIsEdit(true);
      // TODO: 加载现有记录
    }
  }, [id]);

  const loadMembers = async () => {
    try {
      await fetchMembers({ onlyDeceased: true });
    } catch (e) {
      console.error('Failed to load members', e);
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
    if (!title.trim()) {
      Alert.alert('提示', '请输入标题');
      return;
    }
    if (!selectedMemberId) {
      Alert.alert('提示', '请选择关联的家族成员');
      return;
    }

    setLoading(true);
    try {
      const data: CreateMemoryRequest = {
        familyMemberId: selectedMemberId,
        type,
        title: title.trim(),
        content: content || undefined,
        memoryDate: memoryDate || new Date().toISOString().split('T')[0],
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      };

      // if (isEdit && id) {
      //   await memoryApi.update(id, data);
      // } else {
      //   await memoryApi.create(data);
      // }

      Alert.alert('成功', isEdit ? '更新成功' : '创建成功', [
        { text: '确定', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('失败', e instanceof Error ? e.message : '请重试');
    } finally {
      setLoading(false);
    }
  };

  const selectType = (value: string) => {
    setType(value);
    setShowTypePicker(false);
  };

  const selectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowMemberPicker(false);
  };

  const getTypeLabel = (value: string) => {
    return MEMORY_TYPE_OPTIONS.find((o) => o.value === value)?.label || value;
  };

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>类型 *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTypePicker(true)}
          >
            <Text style={type ? styles.inputText : styles.placeholder}>
              {type ? getTypeLabel(type) : '请选择类型'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {showTypePicker && (
          <View style={styles.pickerOverlay}>
            <View style={styles.picker}>
              {MEMORY_TYPE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.pickerItem}
                  onPress={() => selectType(option.value)}
                >
                  <Text style={styles.pickerItemText}>{option.label}</Text>
                  {type === option.value && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.pickerItem, styles.pickerCancel]}
                onPress={() => setShowTypePicker(false)}
              >
                <Text style={styles.pickerCancelText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>关联逝者 *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowMemberPicker(true)}
          >
            <Text style={selectedMemberId ? styles.inputText : styles.placeholder}>
              {selectedMember?.name || '请选择家族成员'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {showMemberPicker && (
          <View style={styles.pickerOverlay}>
            <View style={styles.picker}>
              {members.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.pickerItem}
                  onPress={() => selectMember(member.id)}
                >
                  <Text style={styles.pickerItemText}>{member.name}</Text>
                  {selectedMemberId === member.id && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.pickerItem, styles.pickerCancel]}
                onPress={() => setShowMemberPicker(false)}
              >
                <Text style={styles.pickerCancelText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>标题 *</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入标题"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>日期</Text>
          <TextInput
            style={styles.input}
            placeholder="例如: 2024-04-04"
            value={memoryDate}
            onChangeText={setMemoryDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>内容</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="想说的话..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
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
          {loading ? '保存中...' : isEdit ? '更新' : '保存'}
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  textArea: {
    height: 140,
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
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  picker: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  pickerCancel: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    backgroundColor: '#f8f8f8',
  },
  pickerCancelText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
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
