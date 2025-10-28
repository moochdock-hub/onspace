import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuditSession, AuditContextType, AuditAnalysis } from '../types/audit';
import { AnalysisEngine } from '../utils/analysisEngine';

const AuditContext = createContext<AuditContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SESSIONS: '@ego_auditor_sessions',
  DISCLAIMER: '@ego_auditor_disclaimer'
};

export function AuditProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<AuditSession | null>(null);
  const [sessions, setSessions] = useState<AuditSession[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [disclaimerAccepted, setDisclaimerAcceptedState] = useState(false);

  const analysisEngine = AnalysisEngine.getInstance();

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedSessions, storedDisclaimer] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
        AsyncStorage.getItem(STORAGE_KEYS.DISCLAIMER)
      ]);

      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }

      if (storedDisclaimer) {
        setDisclaimerAcceptedState(JSON.parse(storedDisclaimer));
      }
    } catch (error) {
      console.error('Failed to load stored data:', error);
    }
  };

  const saveSessionsToStorage = async (updatedSessions: AuditSession[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  };

  const createSession = (narrative: string, images?: string[]) => {
    const session: AuditSession = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      narrative,
      images,
      isComplete: false
    };

    setCurrentSession(session);
    const updatedSessions = [session, ...sessions];
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
  };

  const analyzeSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId) || currentSession;
    if (!session) return;

    setIsAnalyzing(true);
    
    try {
      const previousNarratives = sessions
        .filter(s => s.id !== sessionId && s.analysis)
        .map(s => s.narrative)
        .slice(0, 3); // Last 3 sessions for context

      const analysis = await analysisEngine.analyzeNarrative(
        session.narrative,
        previousNarratives
      );

      const updatedSession = {
        ...session,
        analysis,
        isComplete: true
      };

      setCurrentSession(updatedSession);

      const updatedSessions = sessions.map(s => 
        s.id === sessionId ? updatedSession : s
      );
      
      setSessions(updatedSessions);
      await saveSessionsToStorage(updatedSessions);

    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const setDisclaimerAccepted = async (accepted: boolean) => {
    setDisclaimerAcceptedState(accepted);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DISCLAIMER, JSON.stringify(accepted));
    } catch (error) {
      console.error('Failed to save disclaimer status:', error);
    }
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  const clearAllSessions = async () => {
    setSessions([]);
    setCurrentSession(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS);
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    }
  };

  const value: AuditContextType = {
    currentSession,
    sessions,
    isAnalyzing,
    disclaimerAccepted,
    createSession,
    analyzeSession,
    setDisclaimerAccepted,
    deleteSession,
    clearAllSessions
  };

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within AuditProvider');
  }
  return context;
}