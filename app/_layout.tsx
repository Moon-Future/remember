import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();

  // 这里可以处理登录状态的重定向逻辑

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
