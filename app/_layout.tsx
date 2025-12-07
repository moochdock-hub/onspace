import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuditProvider } from '../providers/AuditProvider';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuditProvider>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="disclaimer" />
        <Stack.Screen name="audit" />
        <Stack.Screen name="results" />
        <Stack.Screen name="history" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuditProvider>
  );
}