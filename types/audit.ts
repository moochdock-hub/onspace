export interface AuditSession {
  id: string;
  timestamp: number;
  narrative: string;
  images?: string[];
  analysis?: AuditAnalysis;
  isComplete: boolean;
}

export interface AuditAnalysis {
  signalScan: string[];
  mirrorReflection: string[];
  auditFindings: string[];
  cognitiveBlueprint: string;
  remedyPath: string[];
  check: string[];
  yourMove: string;
  crisisDetected?: boolean;
}

export interface AuditContextType {
  currentSession: AuditSession | null;
  sessions: AuditSession[];
  isAnalyzing: boolean;
  disclaimerAccepted: boolean;
  createSession: (narrative: string, images?: string[]) => string;
  analyzeSession: (sessionId: string) => Promise<void>;
  setDisclaimerAccepted: (accepted: boolean) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
}

export interface AnalysisSection {
  id: string;
  title: string;
  content: string[];
  theme: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'teal' | 'gold';
  collapsed: boolean;
}