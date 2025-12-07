import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { AuditSession, AuditContextType, AuditAnalysis } from '../types/audit';
import { AnalysisEngine } from '../utils/analysisEngine';

const AuditContext = createContext<AuditContextType | undefined>(undefined);

// Simple storage helper that works on web and native
const useStorage = () => {
  const isWeb = typeof window !== 'undefined';
  
  return {
    getItem: async (key: string) => {
      if (isWeb) {
        return localStorage.getItem(key);
      }
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
        return AsyncStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      if (isWeb) {
        localStorage.setItem(key, value);
      } else {
        try {
          const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
          return AsyncStorage.setItem(key, value);
        } catch {
          return null;
        }
      }
    },
    removeItem: async (key: string) => {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        try {
          const AsyncStorage = await import('@react-native-async-storage/async-storage').then(m => m.default);
          return AsyncStorage.removeItem(key);
        } catch {
          return null;
        }
      }
    }
  };
};

const STORAGE_KEYS = {
  SESSIONS: '@ego_auditor_sessions',
  DISCLAIMER: '@ego_auditor_disclaimer'
};

export function AuditProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<AuditSession | null>(null);
  const [sessions, setSessions] = useState<AuditSession[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [disclaimerAccepted, setDisclaimerAcceptedState] = useState(false);
  const lastCreatedRef = useRef<AuditSession | null>(null);

  const analysisEngine = AnalysisEngine.getInstance();
  const storage = useStorage();

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedSessions, storedDisclaimer] = await Promise.all([
        storage.getItem(STORAGE_KEYS.SESSIONS),
        storage.getItem(STORAGE_KEYS.DISCLAIMER)
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
      await storage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  };

  const createSession = (narrative: string, images?: string[]): string => {
    const session: AuditSession = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      narrative,
      images,
      isComplete: false
    };

    lastCreatedRef.current = session;
    setCurrentSession(session);
    const updatedSessions = [session, ...sessions];
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
    return session.id;
  };

  const analyzeSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId) || currentSession || lastCreatedRef.current;
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

      let updatedSessions = sessions.map(s => 
        s.id === sessionId ? updatedSession : s
      );
      if (!updatedSessions.some(s => s.id === sessionId)) {
        updatedSessions = [updatedSession, ...updatedSessions];
      }
      
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
      await storage.setItem(STORAGE_KEYS.DISCLAIMER, JSON.stringify(accepted));
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
      await storage.removeItem(STORAGE_KEYS.SESSIONS);
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