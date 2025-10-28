import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, CheckCircle } from 'lucide-react-native';
import { TerminalText } from '../components/TerminalText';
import { useAudit } from '../providers/AuditProvider';
import { Colors, Spacing } from '../constants/theme';

export default function DisclaimerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setDisclaimerAccepted } = useAudit();
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAccept = () => {
    setDisclaimerAccepted(true);
    router.replace('/audit');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AlertTriangle size={32} color={Colors.error} />
          <TerminalText variant="header" color="error" style={styles.title}>
            LEGAL DISCLAIMER
          </TerminalText>
          <TerminalText variant="mono" color="secondary">
            MANDATORY ACKNOWLEDGMENT REQUIRED
          </TerminalText>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <TerminalText variant="header" color="primary" style={styles.sectionTitle}>
              → CRITICAL WARNINGS
            </TerminalText>
            
            <TerminalText style={styles.warningText}>
              This application is NOT a therapeutic tool, medical device, or substitute for professional mental health treatment.
            </TerminalText>
            
            <TerminalText style={styles.warningText}>
              The Ego&apos;s Auditor provides forensic analysis for self-examination purposes only. It does not diagnose, treat, or cure any medical or psychological condition.
            </TerminalText>
          </View>

          <View style={styles.section}>
            <TerminalText variant="header" color="orange" style={styles.sectionTitle}>
              → EMERGENCY PROTOCOLS
            </TerminalText>
            
            <TerminalText style={styles.text}>
              If you experience thoughts of self-harm or suicide:
            </TerminalText>
            <TerminalText variant="mono" color="error" style={styles.emergencyText}>
              • Call 988 (Suicide & Crisis Lifeline)
              • Text HOME to 741741 (Crisis Text Line)
              • Call 911 for immediate danger
            </TerminalText>
          </View>

          <View style={styles.section}>
            <TerminalText variant="header" color="blue" style={styles.sectionTitle}>
              → DATA SECURITY
            </TerminalText>
            
            <TerminalText style={styles.text}>
              All audit data is stored locally on your device. No personal information is transmitted to external servers except for AI analysis processing, which is anonymized.
            </TerminalText>
          </View>

          <View style={styles.section}>
            <TerminalText variant="header" color="purple" style={styles.sectionTitle}>
              → USER RESPONSIBILITY
            </TerminalText>
            
            <TerminalText style={styles.text}>
              By proceeding, you acknowledge that you are using this tool for personal insight only and will seek professional help for serious psychological concerns.
            </TerminalText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcknowledged(!acknowledged)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, acknowledged && styles.checkboxChecked]}>
            {acknowledged && <CheckCircle size={20} color={Colors.primary} />}
          </View>
          <TerminalText style={styles.checkboxText}>
            I understand and acknowledge all warnings and limitations
          </TerminalText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.acceptButton, !acknowledged && styles.acceptButtonDisabled]}
          onPress={handleAccept}
          disabled={!acknowledged}
          activeOpacity={0.7}
        >
          <TerminalText 
            variant="header" 
            color={acknowledged ? 'background' : 'text'}
            style={styles.acceptButtonText}
          >
            PROCEED TO AUDIT
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
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borders,
  },
  title: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  text: {
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  warningText: {
    lineHeight: 22,
    marginBottom: Spacing.md,
    color: Colors.error,
  },
  emergencyText: {
    marginTop: Spacing.sm,
    paddingLeft: Spacing.md,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borders,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.borders,
    borderRadius: 4,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: Colors.primary,
  },
  checkboxText: {
    flex: 1,
    lineHeight: 20,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 4,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: Colors.borders,
  },
  acceptButtonText: {
    fontSize: 16,
  },
});