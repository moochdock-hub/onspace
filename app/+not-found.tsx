import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, Home } from 'lucide-react-native';
import { TerminalText } from '../components/TerminalText';
import { Colors, Spacing } from '../constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <AlertTriangle size={64} color={Colors.error} />
        
        <TerminalText variant="header" color="error" style={styles.title}>
          404 - PATH NOT FOUND
        </TerminalText>
        
        <TerminalText variant="mono" style={styles.subtitle}>
          AUDIT SYSTEM ERROR: INVALID ROUTE DETECTED
        </TerminalText>
        
        <TerminalText style={styles.description}>
          The requested audit path does not exist in the forensic system database.
          Redirecting to main audit interface...
        </TerminalText>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/audit')}
          activeOpacity={0.7}
        >
          <Home size={20} color={Colors.background} />
          <TerminalText variant="header" color="background" style={styles.buttonText}>
            RETURN TO AUDIT
          </TerminalText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  title: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 4,
  },
  buttonText: {
    marginLeft: Spacing.sm,
  },
});