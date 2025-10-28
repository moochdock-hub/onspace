import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TerminalText } from '../components/TerminalText';
import { useAudit } from '../providers/AuditProvider';
import { Colors, Spacing } from '../constants/theme';

export default function LoadingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { disclaimerAccepted } = useAudit();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (disclaimerAccepted) {
        router.replace('/audit');
      } else {
        router.replace('/disclaimer');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [disclaimerAccepted, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TerminalText variant="header" color="primary" style={styles.title}>
          THE EGO'S AUDITOR
        </TerminalText>
        
        <TerminalText variant="mono" style={styles.version}>
          v2.0 - FORENSIC PSYCHOLOGICAL AUDIT SYSTEM
        </TerminalText>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <TerminalText variant="mono" style={styles.loadingText}>
            INITIALIZING AUDIT PROTOCOLS...
          </TerminalText>
        </View>

        <View style={styles.footer}>
          <TerminalText variant="small" color="text" style={styles.footerText}>
            → SCANNING COGNITIVE PATTERNS
          </TerminalText>
          <TerminalText variant="small" color="text" style={styles.footerText}>
            → LOADING DEFENSE ALGORITHMS
          </TerminalText>
          <TerminalText variant="small" color="text" style={styles.footerText}>
            → CALIBRATING TRUTH DETECTION
          </TerminalText>
        </View>
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
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  version: {
    textAlign: 'center',
    color: Colors.secondary,
    marginBottom: Spacing.xxl,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.primary,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    marginBottom: Spacing.xs,
    opacity: 0.7,
  },
});