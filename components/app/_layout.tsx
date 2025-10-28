import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuditProvider } from '../providers/AuditProvider';
import { Colors } from '../constants/theme';

export default function RootLayout() {
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