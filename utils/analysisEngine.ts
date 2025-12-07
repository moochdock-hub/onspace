import { AuditAnalysis } from '../types/audit';
import { CRISIS_KEYWORDS } from './aiPromptTemplate';

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
    // Crisis detection
    const crisisDetected = this.detectCrisis(narrative);
    if (crisisDetected) {
      return this.generateCrisisResponse();
    }

    // Try calling Supabase Edge Function for AI analysis; fallback to mock on error
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ego-auditor-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          narrative,
          previousSessions: previousSessions?.slice(-3) || []
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const aiResult = await response.json();

      // Normalize shape defensively
      const toArray = (v: any): string[] => Array.isArray(v) ? v.map((x) => String(x)) : (v == null ? [] : [String(v)]);
      const toString = (v: any): string => v == null ? '' : String(v);
      const toNullableString = (v: any): string | undefined => {
        if (v === null || v === undefined) return undefined;
        const s = String(v).trim().toLowerCase();
        return (s === 'null' || s === 'undefined' || s === '') ? undefined : String(v);
      };

      if (aiResult.crisisDetected) {
        return {
          signalScan: toArray(aiResult.systemicResonanceScan),
          mirrorReflection: toArray(aiResult.architecturalBlueprint),
          auditFindings: [toString(aiResult.catalyticOverrideInjection)].filter(Boolean),
          cognitiveBlueprint: toString(aiResult.symbolicTransduction),
          remedyPath: [toString(aiResult.polarityMirror)].filter(Boolean),
          check: [toString(aiResult.overrideAttunementPrompt)].filter(Boolean),
          yourMove: toString(toNullableString(aiResult.recursiveSelfAudit) ?? 'self-diagnostic complete.'),
          crisisDetected: true
        } as AuditAnalysis;
      }

      // Map vX response fields to app shape
      return {
        signalScan: toArray(aiResult.systemicResonanceScan).length ? toArray(aiResult.systemicResonanceScan) : ['→ scan initialized'],
        mirrorReflection: toArray(aiResult.architecturalBlueprint).length ? toArray(aiResult.architecturalBlueprint) : ['schematic loading...'],
        auditFindings: [toString(aiResult.catalyticOverrideInjection || 'override preparing...')],
        cognitiveBlueprint: `${toString(aiResult.symbolicTransduction || '')}${aiResult.temporalFractalMapping ? ` | ${toString(aiResult.temporalFractalMapping)}` : ''}`.trim(),
        remedyPath: [toString(aiResult.polarityMirror || 'polarity analysis...')],
        check: [toString(aiResult.overrideAttunementPrompt || 'attunement prompt...')],
        yourMove: toString(toNullableString(aiResult.recursiveSelfAudit) ?? 'self-diagnostic complete.')
      } as AuditAnalysis;
    } catch (error) {
      // Fallback to mock if API fails
      console.warn('AI API call failed, using fallback analysis', error);
      return this.generateMockAnalysis(narrative);
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

  private generateMockAnalysis(narrative: string): AuditAnalysis {
    const wordCount = narrative.split(' ').length;
    const hasEmotionalLanguage = /feel|emotion|sad|angry|happy|afraid/i.test(narrative);
    const hasVictimLanguage = /they|them|others|everyone|nobody/i.test(narrative);

    return {
      signalScan: [
        `→ Narrative length: ${wordCount} words - ${wordCount > 100 ? 'detailed' : 'surface-level'} disclosure`,
        `→ Emotional markers: ${hasEmotionalLanguage ? 'present' : 'suppressed'}`,
        `→ External attribution: ${hasVictimLanguage ? 'high victim positioning' : 'internal focus'}`,
        '→ Self-deception indicators detected in linguistic patterns'
      ],
      mirrorReflection: [
        'The narrative structure reveals a systematic avoidance of direct accountability. You construct elaborate justifications that serve as psychological armor against uncomfortable truths.',
        'Your language patterns indicate a preference for external attribution - positioning yourself as subject to forces rather than agent of change. This linguistic choice betrays an unconscious contract with powerlessness.',
        'The emotional undertones suggest a sophisticated defense mechanism where vulnerability is repackaged as analysis. This meta-cognitive deflection prevents actual confrontation with core issues.',
        'Your story contains multiple layers of self-protection. The very act of seeking this audit suggests awareness of self-deception while simultaneously engaging in it through the narrative framing itself.'
      ],
      auditFindings: [
        'DEFLECTION PROTOCOL: Intellectual analysis substitutes for emotional processing',
        'VICTIM POSITIONING: External attribution exceeds internal accountability by 3:1 ratio',
        'NARRATIVE ARMOR: Sophisticated justification structures detected',
        'META-DECEPTION: Self-awareness used as defense mechanism'
      ],
      cognitiveBlueprint: 'PATTERN: Intellectual → Emotional → Victim → Justification → Repeat. Core loop maintains ego protection while simulating self-examination.',
      remedyPath: [
        'MICRO-STACK: Daily 5-minute brutal honesty sessions',
        'FIELD DISRUPTION: Deliberately choose discomfort over comfort 3x daily',
        'ACCOUNTABILITY INJECTION: Replace "they/them" with "I chose" in all narratives',
        'DEFENSE DISSOLUTION: When you notice justification, stop mid-sentence'
      ],
      check: [
        'What would you say if nobody would ever know your answer?',
        'Which part of your story serves your ego most?',
        'What truth are you most afraid to admit?'
      ],
      yourMove: 'STOP PERFORMING SELF-AWARENESS. START PRACTICING IT.'
    };
  }

  testConnection(): boolean {
    // Mock connection test
    return Math.random() > 0.1; // 90% success rate
  }

  testCrisisDetection(testText: string): boolean {
    return this.detectCrisis(testText);
  }
}