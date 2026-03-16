import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFamilyStore, useAuthStore } from '@/store';
import { useCamera } from '@/hooks';
import type { CreateFamilyMemberRequest, RelationType } from '@/types';
import { RELATION_OPTIONS, getRelationLabel } from '@/types/family';

export default function AddFamilyMemberScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { selectedMember, createMember, updateMember, fetchMemberDetail } = useFamilyStore();
  const { takePhoto, pickImage } = useCamera();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState<RelationType>('other');
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isDeceased, setIsDeceased] = useState(true);
  const [autoCreateReminder, setAutoCreateReminder] = useState(true);
  const [showRelationPicker, setShowRelationPicker] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      loadMember(id);
    }
  }, [id]);

  const loadMember = async (memberId: string) => {
    setLoading(true);
    try {
      const member = await fetchMemberDetail(memberId);
      if (member) {
        setName(member.name);
        setRelation(member.relation);
        setBirthYear(member.birthYear?.toString() || '');
        setDeathYear(member.deathYear?.toString() || '');
        setDeathDate(member.deathDate || '');
        setPhotoUrl(member.photoUrl || '');
        setBio(member.bio || '');
        setIsDeceased(member.isDeceased);
      }
    } catch (e) {
      console.error('Failed to load member', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await takePhoto();
      setPhotoUrl(photo.uri);
    } catch (e) {
      if (e instanceof Error && e.message !== '取消拍照') {
        Alert.alert('提示', e.message);
      }
    }
  };

  const handlePickImage = async () => {
    try {
      const photo = await pickImage({ allowsMultipleSelection: false });
      if (!Array.isArray(photo)) {
        setPhotoUrl(photo.uri);
      }
    } catch (e) {
      if (e instanceof Error && e.message !== '取消选择') {
        Alert.alert('提示', e.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入姓名');
      return;
    }

    setLoading(true);
    try {
      const data: CreateFamilyMemberRequest = {
        name: name.trim(),
        relation,
        birthYear: birthYear ? parseInt(birthYear) : undefined,
        deathYear: deathYear ? parseInt(deathYear) : undefined,
        deathDate: deathDate || undefined,
        photoUrl: photoUrl || undefined,
        bio: bio || undefined,
        isDeceased,
        autoCreateReminder: isEdit ? undefined : autoCreateReminder,
      };

      if (isEdit && id) {
        await updateMember(id, data);
      } else {
        await createMember(data);
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

  const selectRelation = (value: RelationType) => {
    setRelation(value);
    setShowRelationPicker(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TouchableOpacity style={styles.photoSection} onPress={handleTakePhoto}>
          {photoUrl ? (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="image" size={40} color="#ccc" />
              <Text style={styles.photoPlaceholderText}>已选择照片</Text>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={40} color="#ccc" />
              <Text style={styles.photoPlaceholderText}>点击添加照片</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>姓名 *</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入姓名"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>关系 *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowRelationPicker(true)}
          >
            <Text style={relation ? styles.inputText : styles.placeholder}>
              {relation ? getRelationLabel(relation) : '请选择关系'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {showRelationPicker && (
          <View style={styles.pickerOverlay}>
            <View style={styles.picker}>
              {RELATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.pickerItem}
                  onPress={() => selectRelation(option.value)}
                >
                  <Text style={styles.pickerItemText}>{option.label}</Text>
                  {relation === option.value && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.pickerItem, styles.pickerCancel]}
                onPress={() => setShowRelationPicker(false)}
              >
                <Text style={styles.pickerCancelText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.label}>是否已故</Text>
          <TouchableOpacity
            style={styles.switch}
            onPress={() => setIsDeceased(!isDeceased)}
          >
            <View style={[styles.switchThumb, isDeceased && styles.switchThumbOn]} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>出生年份</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入出生年份"
            value={birthYear}
            onChangeText={setBirthYear}
            keyboardType="number-pad"
          />
        </View>

        {isDeceased && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>去世年份</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入去世年份"
                value={deathYear}
                onChangeText={setDeathYear}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>忌日 (可选)</Text>
              <TextInput
                style={styles.input}
                placeholder="例如: 2024-04-04"
                value={deathDate}
                onChangeText={setDeathDate}
              />
            </View>

            {!isEdit && (
              <View style={styles.switchRow}>
                <Text style={styles.label}>自动创建忌日提醒</Text>
                <TouchableOpacity
                  style={styles.switch}
                  onPress={() => setAutoCreateReminder(!autoCreateReminder)}
                >
                  <View style={[styles.switchThumb, autoCreateReminder && styles.switchThumbOn]} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>简介</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="请输入简介"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? '保存中...' : isEdit ? '更新' : '创建'}
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
  photoSection: {
    marginBottom: 16,
  },
  photoPlaceholder: {
    height: 160,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: '#999',
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
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
