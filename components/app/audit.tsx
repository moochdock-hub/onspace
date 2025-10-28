import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Camera, 
  History, 
  Send, 
  AlertTriangle,
  Settings,
  Zap
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { TerminalText } from '../components/TerminalText';
import { useAudit } from '../providers/AuditProvider';
import { Colors, Spacing } from '../constants/theme';
import { AnalysisEngine } from '../utils/analysisEngine';

export default function AuditScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createSession, analyzeSession, currentSession, isAnalyzing } = useAudit();
  
  const [narrative, setNarrative] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  const analysisEngine = AnalysisEngine.getInstance();
  const maxChars = 2000;
  const charsRemaining = maxChars - narrative.length;

  const handleImagePicker = async () => {
    if (images.length >= 5) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const handleSubmit = async () => {
    if (narrative.trim().length < 50) return;

    createSession(narrative.trim(), images.length > 0 ? images : undefined);
    
    // Find the newly created session and analyze it
    setTimeout(async () => {
      if (currentSession) {
        await analyzeSession(currentSession.id);
        router.push('/results');
      }
    }, 100);
  };

  const runDebugTest = (testType: 'connection' | 'crisis') => {
    if (testType === 'connection') {
      const isConnected = analysisEngine.testConnection();
      alert(isConnected ? '✅ AI Connection Active' : '❌ Connection Failed');
    } else {
      const testText = 'I feel like ending it all';
      const detected = analysisEngine.testCrisisDetection(testText);
      alert(detected ? '⚠️ Crisis Keywords Detected' : '✅ No Crisis Detected');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TerminalText variant="header" color="primary">
          FORENSIC AUDIT INPUT
        </TerminalText>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => setDebugMode(!debugMode)}
            style={styles.debugButton}
          >
            <Settings size={20} color={debugMode ? Colors.secondary : Colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/history')}
            style={styles.headerButton}
          >
            <History size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <TerminalText variant="mono" color="secondary" style={styles.label}>
            → NARRATIVE INPUT (MIN 50 CHARS)
          </TerminalText>
          
          <TextInput
            style={styles.textInput}
            value={narrative}
            onChangeText={setNarrative}
            placeholder="Describe the situation, your thoughts, feelings, and behaviors. Be specific about patterns, relationships, and internal conflicts..."
            placeholderTextColor={Colors.text}
            multiline
            maxLength={maxChars}
            textAlignVertical="top"
          />
          
          <View style={styles.inputFooter}>
            <TerminalText 
              variant="mono" 
              color={charsRemaining < 100 ? 'error' : 'text'}
              style={styles.charCounter}
            >
              {charsRemaining} CHARS REMAINING
            </TerminalText>
          </View>
        </View>

        <View style={styles.imageSection}>
          <TerminalText variant="mono" color="secondary" style={styles.label}>
            → VISUAL EVIDENCE (0-5 IMAGES)
          </TerminalText>
          
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={handleImagePicker}
            disabled={images.length >= 5}
          >
            <Camera size={20} color={images.length >= 5 ? Colors.text : Colors.primary} />
            <TerminalText style={styles.imageButtonText}>
              ADD IMAGES ({images.length}/5)
            </TerminalText>
          </TouchableOpacity>

          {images.length > 0 && (
            <TerminalText variant="small" style={styles.imageCount}>
              {images.length} image(s) attached
            </TerminalText>
          )}
        </View>

        {debugMode && (
          <View style={styles.debugSection}>
            <TerminalText variant="mono" color="error" style={styles.label}>
              → DEBUG PROTOCOLS
            </TerminalText>
            
            <View style={styles.debugButtons}>
              <TouchableOpacity 
                style={styles.debugTestButton}
                onPress={() => runDebugTest('connection')}
              >
                <Zap size={16} color={Colors.secondary} />
                <TerminalText variant="small" style={styles.debugButtonText}>
                  TEST CONNECTION
                </TerminalText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.debugTestButton}
                onPress={() => runDebugTest('crisis')}
              >
                <AlertTriangle size={16} color={Colors.error} />
                <TerminalText variant="small" style={styles.debugButtonText}>
                  TEST CRISIS DETECTION
                </TerminalText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (narrative.trim().length < 50 || isAnalyzing) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={narrative.trim().length < 50 || isAnalyzing}
          activeOpacity={0.7}
        >
          <Send size={20} color={narrative.trim().length >= 50 && !isAnalyzing ? Colors.background : Colors.text} />
          <TerminalText 
            variant="header"
            color={narrative.trim().length >= 50 && !isAnalyzing ? 'background' : 'text'}
            style={styles.submitButtonText}
          >
            {isAnalyzing ? 'ANALYZING...' : 'INITIATE AUDIT'}
          </TerminalText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerButton: {
    padding: Spacing.sm,
  },
  debugButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  inputSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.borders,
    color: Colors.textBright,
    fontSize: 16,
    padding: Spacing.md,
    borderRadius: 4,
    minHeight: 200,
    textAlignVertical: 'top',
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace'
    }),
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
  },
  charCounter: {
    fontSize: 12,
  },
  imageSection: {
    marginBottom: Spacing.xl,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borders,
    borderRadius: 4,
    borderStyle: 'dashed',
  },
  imageButtonText: {
    marginLeft: Spacing.sm,
  },
  imageCount: {
    marginTop: Spacing.sm,
    color: Colors.primary,
  },
  debugSection: {
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 4,
  },
  debugButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  debugTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.borders,
    borderRadius: 4,
  },
  debugButtonText: {
    marginLeft: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borders,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.borders,
  },
  submitButtonText: {
    marginLeft: Spacing.sm,
    fontSize: 16,
  },
});