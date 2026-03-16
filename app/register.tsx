import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks';

export default function RegisterScreen() {
  const router = useRouter();
  const { sendCode, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('提示', '请输入邮箱');
      return;
    }

    setCodeSending(true);
    try {
      await sendCode({ email, isProd: true });
      Alert.alert('提示', '验证码已发送');
      startCountdown();
    } catch (e) {
      Alert.alert('发送失败', e instanceof Error ? e.message : '请重试');
    } finally {
      setCodeSending(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRegister = async () => {
    if (!email || !password || !emailCode) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('提示', '两次密码输入不一致');
      return;
    }

    setLoading(true);
    try {
      await register({
        email,
        emailCode,
        password,
        salt: '',
        projectId: 'family_trace',
      });
      Alert.alert('注册成功', '请登录', [
        { text: '确定', onPress: () => router.replace('/login') },
      ]);
    } catch (e) {
      Alert.alert('注册失败', e instanceof Error ? e.message : '请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>注册账号</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="请输入邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.codeContainer}>
          <TextInput
            style={[styles.input, styles.codeInput]}
            placeholder="请输入验证码"
            value={emailCode}
            onChangeText={setEmailCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={[styles.codeButton, countdown > 0 && styles.codeButtonDisabled]}
            onPress={handleSendCode}
            disabled={countdown > 0 || codeSending}
          >
            <Text style={styles.codeButtonText}>
              {countdown > 0 ? `${countdown}s` : '发送验证码'}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="请输入密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="请确认密码"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '注册中...' : '注册'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.back()}
        >
          <Text style={styles.linkText}>已有账号？去登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  form: {
    gap: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  codeInput: {
    flex: 1,
  },
  codeButton: {
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  codeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  codeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  button: {
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
