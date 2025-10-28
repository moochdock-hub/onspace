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
  Trash2, 
  Eye,
  Calendar,
  FileText
} from 'lucide-react-native';
import { TerminalText } from '../components/TerminalText';
import { useAudit } from '../providers/AuditProvider';
import { Colors, Spacing } from '../constants/theme';
import { AuditSession } from '../types/audit';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sessions, deleteSession, clearAllSessions } = useAudit();

  const handleViewSession = (session: AuditSession) => {
    // Navigate to results with this session
    router.push('/results');
  };

  const handleDeleteSession = (session: AuditSession) => {
    Alert.alert(
      'Delete Audit Session',
      'This will permanently delete this audit session. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteSession(session.id)
        }
      ]
    );
  };

  const handleClearAll = () => {
    if (sessions.length === 0) return;
    
    Alert.alert(
      'Clear All Sessions',
      'This will permanently delete all audit sessions. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: clearAllSessions
        }
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionPreview = (narrative: string) => {
    return narrative.length > 120 ? narrative.substring(0, 120) + '...' : narrative;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <TerminalText variant="header" color="primary">
          AUDIT ARCHIVE
        </TerminalText>
        
        <TouchableOpacity onPress={handleClearAll}>
          <Trash2 size={20} color={sessions.length > 0 ? Colors.error : Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <TerminalText variant="mono" color="secondary">
          TOTAL SESSIONS: {sessions.length}
        </TerminalText>
        <TerminalText variant="mono" color="secondary">
          COMPLETED: {sessions.filter(s => s.isComplete).length}
        </TerminalText>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText size={48} color={Colors.borders} />
          <TerminalText variant="header" color="text" style={styles.emptyTitle}>
            NO AUDIT HISTORY
          </TerminalText>
          <TerminalText style={styles.emptyText}>
            Complete your first audit session to build your forensic history.
          </TerminalText>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.push('/audit')}
          >
            <TerminalText variant="header" color="background">
              START AUDIT
            </TerminalText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionMeta}>
                  <TerminalText variant="mono" color="secondary" style={styles.sessionId}>
                    #{session.id.slice(-6)}
                  </TerminalText>
                  <View style={styles.sessionDate}>
                    <Calendar size={12} color={Colors.text} />
                    <TerminalText variant="small" style={styles.dateText}>
                      {formatDate(session.timestamp)}
                    </TerminalText>
                  </View>
                </View>
                
                <View style={styles.sessionActions}>
                  {session.isComplete && (
                    <TouchableOpacity 
                      onPress={() => handleViewSession(session)}
                      style={styles.actionButton}
                    >
                      <Eye size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    onPress={() => handleDeleteSession(session)}
                    style={styles.actionButton}
                  >
                    <Trash2 size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <TerminalText style={styles.sessionPreview}>
                {getSessionPreview(session.narrative)}
              </TerminalText>

              <View style={styles.sessionFooter}>
                <TerminalText 
                  variant="small" 
                  color={session.isComplete ? 'green' : 'orange'}
                >
                  {session.isComplete ? '✓ ANALYZED' : '⚡ PENDING'}
                </TerminalText>
                
                <TerminalText variant="small" color="text">
                  {session.narrative.length} chars
                  {session.images && ` • ${session.images.length} images`}
                </TerminalText>
              </View>

              {session.analysis?.crisisDetected && (
                <View style={styles.crisisWarning}>
                  <TerminalText variant="small" color="error">
                    ⚠️ CRISIS DETECTED IN THIS SESSION
                  </TerminalText>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
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
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.borders,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  sessionCard: {
    backgroundColor: Colors.borders,
    borderRadius: 4,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sessionMeta: {
    flex: 1,
  },
  sessionId: {
    marginBottom: Spacing.xs,
  },
  sessionDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: Spacing.xs,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  sessionPreview: {
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crisisWarning: {
    marginTop: Spacing.sm,
    padding: Spacing.xs,
    backgroundColor: Colors.error,
    borderRadius: 4,
  },
});