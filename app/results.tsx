import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  RefreshCw, 
  Share,
  AlertTriangle,
  Phone
} from 'lucide-react-native';
import { TerminalText } from '../components/TerminalText';
import { AnalysisSection } from '../components/AnalysisSection';
import { useAudit } from '../providers/AuditProvider';
import { Colors, Spacing } from '../constants/theme';
import { EMERGENCY_RESOURCES } from '../utils/aiPromptTemplate';

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, sessions, analyzeSession, createSession } = useAudit();
  const [reanalyzing, setReanalyzing] = useState(false);

  const sessionWithAnalysis = currentSession?.analysis
    ? currentSession
    : sessions.find(s => Boolean(s.analysis)) || null;
  const analysis = sessionWithAnalysis?.analysis || null;
  const crisisDetected = analysis?.crisisDetected;

  const handleReanalyze = async () => {
    const target = sessionWithAnalysis || currentSession;
    if (!target) return;
    
    setReanalyzing(true);
    await analyzeSession(target.id);
    setReanalyzing(false);
  };

  const handleNewAudit = () => {
    router.push('/audit');
  };

  const handleEmergencyCall = (number: string) => {
    Alert.alert(
      'Emergency Contact',
      `Call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log(`Calling ${number}`) }
      ]
    );
  };

  if (!sessionWithAnalysis || !analysis) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TerminalText variant="header" color="error">
          NO ANALYSIS DATA FOUND
        </TerminalText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <TerminalText variant="header" color="primary" animated={false}>
          AUDIT RESULTS
        </TerminalText>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={handleReanalyze}
            disabled={reanalyzing}
          >
            <RefreshCw 
              size={20} 
              color={reanalyzing ? Colors.text : Colors.secondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {crisisDetected && (
        <View style={styles.crisisAlert}>
          <AlertTriangle size={24} color={Colors.error} />
          <View style={styles.crisisContent}>
            <TerminalText variant="header" color="error" animated={false}>
              CRISIS DETECTED
            </TerminalText>
            <TerminalText style={styles.crisisText}>
              Emergency resources activated. Professional help recommended.
            </TerminalText>
            
            <View style={styles.emergencyButtons}>
              <TouchableOpacity 
                style={styles.emergencyButton}
                onPress={() => handleEmergencyCall(EMERGENCY_RESOURCES.suicidePrevention)}
              >
                <Phone size={16} color={Colors.background} />
                <TerminalText color="background" style={styles.emergencyButtonText}>
                  CALL 988
                </TerminalText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.emergencyButton}
                onPress={() => handleEmergencyCall('911')}
              >
                <Phone size={16} color={Colors.background} />
                <TerminalText color="background" style={styles.emergencyButtonText}>
                  CALL 911
                </TerminalText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AnalysisSection
          title="EGO CRIME IDENTIFIED"
          content={analysis.signalScan}
          theme="blue"
        />

        <AnalysisSection
          title="BLUEPRINT OF THE NONSENSE"
          content={analysis.mirrorReflection}
          theme="red"
        />

        <AnalysisSection
          title="CLOWN TECHNOLOGY DEPLOYED"
          content={analysis.auditFindings}
          theme="green"
        />

        <AnalysisSection
          title="COUNTER-SPELL DETONATED"
          content={[analysis.cognitiveBlueprint]}
          theme="purple"
        />

        <AnalysisSection
          title="RETURN THE MIC"
          content={analysis.remedyPath}
          theme="orange"
        />

        <AnalysisSection
          title="CHECK"
          content={analysis.check}
          theme="teal"
        />

        <AnalysisSection
          title="YOUR MOVE"
          content={[analysis.yourMove]}
          theme="gold"
        />

        <View style={styles.sessionInfo}>
          <TerminalText variant="small" color="text">
            SESSION ID: {sessionWithAnalysis.id}
          </TerminalText>
          <TerminalText variant="small" color="text">
            TIMESTAMP: {new Date(sessionWithAnalysis.timestamp).toLocaleString()}
          </TerminalText>
          <TerminalText variant="small" color="text">
            NARRATIVE LENGTH: {sessionWithAnalysis.narrative.length} CHARS
          </TerminalText>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.newAuditButton}
          onPress={handleNewAudit}
          activeOpacity={0.7}
        >
          <TerminalText variant="header" color="background" animated={false}>
            NEW AUDIT SESSION
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borders,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  crisisAlert: {
    flexDirection: 'row',
    backgroundColor: Colors.error,
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: 4,
  },
  crisisContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  crisisText: {
    color: Colors.textBright,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  emergencyButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textBright,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 4,
  },
  emergencyButtonText: {
    marginLeft: Spacing.xs,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  sessionInfo: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
    padding: Spacing.md,
    backgroundColor: Colors.borders,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borders,
  },
  newAuditButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 4,
    alignItems: 'center',
  },
});