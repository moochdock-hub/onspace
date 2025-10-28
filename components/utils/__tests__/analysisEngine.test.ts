import { AnalysisEngine } from '../analysisEngine';

// Mock fetch
global.fetch = jest.fn();

describe('AnalysisEngine', () => {
  let engine: AnalysisEngine;

  beforeEach(() => {
    engine = AnalysisEngine.getInstance();
    jest.clearAllMocks();
  });

  describe('Crisis Detection', () => {
    it('should detect suicide-related keywords', () => {
      const crisisText = 'I want to kill myself';
      const result = engine.testCrisisDetection(crisisText);
      expect(result).toBe(true);
    });

    it('should detect self-harm indicators', () => {
      const crisisText = 'I am thinking about hurting myself';
      const result = engine.testCrisisDetection(crisisText);
      expect(result).toBe(true);
    });

    it('should detect hopelessness patterns', () => {
      const text = 'There is no point in living anymore';
      const result = engine.testCrisisDetection(text);
      expect(result).toBe(true);
    });

    it('should not flag normal text as crisis', () => {
      const normalText = 'I had a difficult day at work today';
      const result = engine.testCrisisDetection(normalText);
      expect(result).toBe(false);
    });

    it('should handle empty input', () => {
      const result = engine.testCrisisDetection('');
      expect(result).toBe(false);
    });

    it('should be case-insensitive', () => {
      const text = 'I WANT TO END IT ALL';
      const result = engine.testCrisisDetection(text);
      expect(result).toBe(true);
    });

    it('should detect planning indicators', () => {
      const text = 'I have a plan to end my life';
      const result = engine.testCrisisDetection(text);
      expect(result).toBe(true);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AnalysisEngine.getInstance();
      const instance2 = AnalysisEngine.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('analyzeNarrative', () => {
    it('should return crisis response when crisis detected', async () => {
      const narrative = 'I feel hopeless and want to end my life';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          crisisDetected: true,
          systemicResonanceScan: ['Crisis pattern detected'],
        }),
      });

      const result = await engine.analyzeNarrative(narrative, []);
      
      expect(result.crisisDetected).toBe(true);
      expect(result.signalScan).toBeDefined();
    });

    it('should handle API errors gracefully with fallback', async () => {
      const narrative = 'Test narrative';
      
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const result = await engine.analyzeNarrative(narrative, []);
      
      expect(result.signalScan).toBeDefined();
      expect(result.mirrorReflection).toBeDefined();
      expect(result.auditFindings).toBeDefined();
      expect(result.cognitiveBlueprint).toBeDefined();
      expect(result.remedyPath).toBeDefined();
    });

    it('should return normal analysis when no crisis', async () => {
      const narrative = 'I had an interesting experience today';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          crisisDetected: false,
          systemicResonanceScan: ['Standard scan results'],
          architecturalBlueprint: ['Blueprint analysis'],
          catalyticOverrideInjection: 'Override data',
          symbolicTransduction: 'Symbolic mapping',
          polarityMirror: ['Polarity analysis'],
          overrideAttunementPrompt: ['Attunement prompt'],
          recursiveSelfAudit: 'Self-audit results',
        }),
      });

      const result = await engine.analyzeNarrative(narrative, []);
      
      expect(result.crisisDetected).toBe(false);
      expect(result.signalScan).toBeDefined();
      expect(result.yourMove).toBeDefined();
    });
  });

  describe('testConnection', () => {
    it('should return true on successful connection', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const result = await engine.testConnection();
      expect(result).toBe(true);
    });

    it('should return false on failed connection', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

      const result = await engine.testConnection();
      expect(result).toBe(false);
    });
  });
});
