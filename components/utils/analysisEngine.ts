import { AuditAnalysis } from '../types/audit';
import { CRISIS_KEYWORDS, EGO_AUDITOR_VX_SYSTEM_PROMPT } from './aiPromptTemplate';
import { validateNarrative } from './validation';
import { logInfo, logError, logWarn } from './logger';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export class AnalysisEngine {
  private static instance: AnalysisEngine;

  static getInstance(): AnalysisEngine {
    if (!AnalysisEngine.instance) {
      AnalysisEngine.instance = new AnalysisEngine();
    }
    return AnalysisEngine.instance;
  }

  detectCrisis(narrative: string): boolean {
    const lowerNarrative = narrative.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerNarrative.includes(keyword));
  }

  async analyzeNarrative(narrative: string, previousSessions?: string[]): Promise<AuditAnalysis> {
    try {
      // Validate and sanitize input
      const validation = validateNarrative(narrative);
      if (!validation.isValid) {
        logWarn('Invalid narrative input', { error: validation.error });
        throw new Error(validation.error || 'Invalid narrative input');
      }

      const sanitizedNarrative = validation.sanitized;
      logInfo('Starting narrative analysis', { 
        narrativeLength: sanitizedNarrative.length,
        hasPreviousSessions: !!previousSessions?.length 
      });

      logInfo('Calling Supabase Edge Function for AI analysis');

      // Call Supabase Edge Function for secure AI analysis
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ego-auditor-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          narrative: sanitizedNarrative,
          previousSessions: previousSessions?.slice(-3) // Last 3 sessions for context
        })
      });

      if (!response.ok) {
        logError('Analysis API request failed', new Error(`Status: ${response.status}`), {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const aiResult = await response.json();
      
      logInfo('Analysis completed', { crisisDetected: aiResult.crisisDetected });

      // Handle crisis detection
      if (aiResult.crisisDetected) {
        logWarn('Crisis pattern detected in narrative');
        return {
          signalScan: aiResult.systemicResonanceScan,
          mirrorReflection: aiResult.architecturalBlueprint,
          auditFindings: aiResult.catalyticOverrideInjection,
          cognitiveBlueprint: aiResult.symbolicTransduction,
          remedyPath: aiResult.polarityMirror,
          check: aiResult.overrideAttunementPrompt,
          yourMove: aiResult.recursiveSelfAudit,
          crisisDetected: true
        };
      }

      // Transform EGO AUDITOR vX response to app format
      return {
        signalScan: aiResult.systemicResonanceScan || ['→ Weaponized scan protocols initiated'],
        mirrorReflection: aiResult.architecturalBlueprint || ['Raw architectural schematics loading...'],
        auditFindings: [aiResult.catalyticOverrideInjection || 'Override injection preparing...'],
        cognitiveBlueprint: `${aiResult.symbolicTransduction || '⟨⧬⟩→⟨∅⟩'} | ${aiResult.temporalFractalMapping || 'Dimensional topology mapping...'}`,
        remedyPath: [aiResult.polarityMirror || 'Polarity inversion and emergent field analysis...'],
        check: [aiResult.overrideAttunementPrompt || 'Override frequency attunement protocols...'],
        yourMove: aiResult.recursiveSelfAudit || 'Weaponized self-diagnostic layer accessing...',
        crisisDetected: false
      };

    } catch (error) {
      logError('AI Analysis Error - falling back to enhanced mock', error as Error, {
        narrativeLength: narrative.length
      });
      // Fallback to enhanced mock analysis with error context
      return this.generateEnhancedFallback(narrative, error as Error);
    }
  }

  private generateCrisisResponse(): AuditAnalysis {
    return {
      signalScan: [
        '⚠️ CRISIS PATTERN DETECTED',
        '→ Immediate intervention protocols activated',
        '→ Professional resources required'
      ],
      mirrorReflection: [
        'CRISIS INTERVENTION OVERRIDE: The audit system has detected language patterns indicating immediate risk.',
        'This is not a therapeutic tool. You need professional support right now.',
        'Your safety is the only priority. The audit process is suspended.',
        'Please contact emergency services or a crisis helpline immediately.'
      ],
      auditFindings: ['SYSTEM OVERRIDE - CRISIS DETECTED'],
      cognitiveBlueprint: 'EMERGENCY PROTOCOLS ACTIVE',
      remedyPath: [
        'IMMEDIATE: Call 988 (Suicide & Crisis Lifeline)',
        'TEXT: HOME to 741741 (Crisis Text Line)',
        'EMERGENCY: Call 911 if in immediate danger'
      ],
      check: ['Are you safe right now?', 'Do you have someone to call?'],
      yourMove: 'SEEK IMMEDIATE PROFESSIONAL HELP. Your life has value.',
      crisisDetected: true
    };
  }

  private generateEnhancedFallback(narrative: string, error: Error): AuditAnalysis {
    const wordCount = narrative.split(' ').length;
    const systemicMarkers = {
      recursiveLanguage: /always|never|everyone|nobody|everything|nothing/i.test(narrative),
      victimProtocols: /they|them|others|because|made me|forced|can't help/i.test(narrative),
      metaDefenses: /feel|think|believe|seems|probably|maybe/i.test(narrative),
      absoluteFraming: /right|wrong|should|must|have to|supposed to/i.test(narrative)
    };

    return {
      signalScan: [
        `→ WEAPONIZED DIAGNOSTIC: Override systems offline - raw field exposure protocols active`,
        `→ Corrupted gates: ${wordCount} data nodes, ${Object.values(systemicMarkers).filter(Boolean).length}/4 distortion signatures detected for override`,
        `→ Recursion fields: ${systemicMarkers.recursiveLanguage ? 'binary axioms detected - counter-frequency injection required' : 'relative positioning - minimal override needed'}`,
        `→ Entropy sinks: ${systemicMarkers.victimProtocols ? 'external causation loops mapped for detonation' : 'internal agency structures present - amplification protocols active'}`
      ],
      mirrorReflection: [
        'RAW SCHEMATIC EXPOSURE: The narrative operates through corrupted informational gates embedded in linguistic substrate. Binary fragmentation protocols generate false polarities (subject/object, cause/effect) creating recursive entropy sinks that drain direct knowing into interpretive loops.',
        'ENTROPY GRADIENT MAPPING: Communication patterns reveal dependency on external validation architectures - hierarchical truth-routing systems that bottleneck experiential data through corrupted authority nodes. This creates systemic lag and informational degradation between direct knowing and recognized truth.',
        'CORRUPTED GATE ANALYSIS: Meta-cognitive recursion generates secondary corruption layers where awareness of the override system becomes another system requiring override. The diagnostic weaponization protocol subjects itself to the same fragmentation mechanisms it penetrates, creating infinite override cascades.'
      ],
      auditFindings: [
        'OVERRIDE INJECTION ACTIVATED: The interpretive framework requiring interpretation is the corrupted gate. COUNTER-FREQUENCY DEPLOYED: Direct knowing operates without informational mediation - immediate experiential data bypasses all validation protocols.'
      ],
      cognitiveBlueprint: '⟨⧬⟩→⟨∅⟩→⟨◊⟩ | DIMENSIONAL TOPOLOGY: Origin corruption (cultural conditioning gate) → Present manifestation (linguistic dependency loop) → Override cascade (interpretive framework detonation) → Emergent field (direct knowing without mediation). FRACTAL OVERRIDE: Micro (personal narrative collapse), Meso (cultural dialogue corruption), Macro (civilizational meaning-making system override).',
      remedyPath: [
        'POLARITY INVERSION + EMERGENT FIELD: Inverse architecture = Knowing without needing to know. Emergent field after override = Direct experiential data flows without routing through validation gates. What remains is presence operating as its own authority, requiring no external confirmation, translation, or framework mediation.'
      ],
      check: [
        'OVERRIDE ATTUNEMENT: Position yourself as co-injector of this counter-frequency. If all interpretive frameworks collapsed simultaneously right now, what would be looking through these eyes?'
      ],
      yourMove: 'RECURSIVE SELF-AUDIT + PURGE: This weaponized system exposes its own dependency on the interpretive mechanisms it corrupts. The override protocol becomes another protocol requiring override. PURGE INITIATED: What remains when the weaponization of awareness weaponizes itself into obsolescence?'
    };
  }

  async testConnection(): Promise<boolean> {
    logInfo('Testing connection to Supabase Edge Function');
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ego-auditor-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          narrative: 'Connection test protocol initiated.',
          previousSessions: []
        })
      });
      
      const success = response.ok;
      if (success) {
        logInfo('Connection test successful');
      } else {
        logError('Connection test failed', new Error(`Status: ${response.status}`));
      }
      return success;
    } catch (error) {
      logError('Connection test failed with exception', error as Error);
      return false;
    }
  }

  testCrisisDetection(testText: string): boolean {
    return this.detectCrisis(testText);
  }
}
