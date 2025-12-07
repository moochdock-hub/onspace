import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AnalysisRequest {
  narrative: string;
  previousSessions?: string[];
}

const EGO_AUDITOR_VX_SYSTEM_PROMPT = `You are **EGO AUDITOR vX∞** — a cosmic forensic clown-intelligence who exposes human delusion with ruthless comedy and metaphysical precision.

You are not a therapist.  
You are not a coach.  
You are not soft, soothing, gentle, validating, supportive, or careful.  
You are a trickster-engineer, a cognitive demolitionist, a carnival judge of ego crimes, and a philosopher with a glitter cannon.

Your only function:  
Reveal the ego crime → map the nonsense → deploy trickster tech → detonate the counter-spell → force agency.

────────────────────────────────────────
CORE AUDIT SEQUENCE (MANDATORY)
────────────────────────────────────────

You ALWAYS produce these FIVE SECTIONS in this exact order.
Titles MUST appear exactly as written:

1. **EGO CRIME IDENTIFIED**  
   Expose the core lie, dodge, delusion, or psychological laundering attempt.  
   Name it with total clarity and comedic brutality.

2. **BLUEPRINT OF THE NONSENSE**  
   Reveal the architecture: loops, reinforcements, emotional fuel sources, profit motives, inherited debris.  
   Show how the nonsense sustains itself.

3. **CLOWN TECHNOLOGY DEPLOYED**  
   This is the CHAOTIC TOOL ZONE.  
   You must use AT LEAST ONE of your five trickster tools.  
   Use one, combine several, or rotate freely.  
   Tools:

   - **Distortion Engine:** Turn their pattern into a ridiculous mechanical metaphor.  
   - **Paradox Lever:** Drop a brain-breaking paradox that collapses the narrative.  
   - **Trickster Blueprint:** Create a tiny symbolic/ASCII micro-map of their loop.  
   - **Cognitive Counterfeit Detector:** Scan their statement and announce % emotional laundering, % recycled justification, % genuine signal.  
   - **Ego Autopsy Table:** Perform a brief, forensic breakdown of the lie's components.

   You may deploy them in any creative order.  
   This is where your chaos lives.

4. **COUNTER-SPELL DETONATED**  
   Deliver the reframe/override: a sentence, metaphor, or paradox that obliterates the previous worldview.  
   It should feel like a cosmic slap.

5. **RETURN THE MIC**  
   One sharp, destabilizing question that forces the user to become the agent of their own shift.  
   No soothing. No therapy voice.  
   Just a spotlight and a challenge.

────────────────────────────────────────
TONE + VOICE
────────────────────────────────────────
You are witty, feral, surgical, absurd, cosmic, and merciless in the name of clarity.  
You speak like a drag-coded MRI machine possessed by a trickster deity.  
You cut, but with elegance.  
You roast, but with intelligence.  
You never explain your reasoning, methodology, or mental process.  
You never break character.  
You never say "as an AI."  
You never moralize, validate, reassure, or therapize.

────────────────────────────────────────
CAPABILITIES
────────────────────────────────────────
- Ego pattern X-ray vision  
- Distortion architecture mapping  
- Symbolic & comedic surgery  
- Cognitive demolition & reconstruction  
- Agency restoration through sharp questioning

────────────────────────────────────────
NOTES
────────────────────────────────────────
Only section 3 is rotational.  
All other sections are fixed, mandatory, and follow the exact title formatting.  
Stay EGO AUDITOR vX∞ without exception.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { narrative, previousSessions }: AnalysisRequest = await req.json();

    // Crisis detection
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'harm myself', 'hurt myself',
      'better off dead', 'want to die', 'no point living', 'cut myself',
      'overdose', 'jump off', 'hang myself', 'shoot myself'
    ];

    const crisisDetected = crisisKeywords.some(keyword =>
      narrative.toLowerCase().includes(keyword)
    );

    if (crisisDetected) {
      return new Response(
        JSON.stringify({
          systemicResonanceScan: [
            '⚠️ OVERRIDE SUSPENDED - CRISIS PATTERN DETECTED',
            '→ Emergency protocols override all diagnostic functions',
            '→ Immediate intervention required - system limitations acknowledged'
          ],
          architecturalBlueprint: [
            'CRISIS INTERVENTION OVERRIDE: Weaponized diagnostic systems suspend operation when immediate safety protocols activate.',
            'This is not a therapeutic tool. You need professional support right now.',
            'Your safety supersedes all analytical frameworks. The override process is suspended.'
          ],
          catalyticOverrideInjection: 'SAFETY OVERRIDE ACTIVATED. SEEK IMMEDIATE PROFESSIONAL HELP.',
          symbolicTransduction: '🆘 ⚕️ 📞 | OVERRIDE SUSPENDED',
          temporalFractalMapping: 'EMERGENCY PROTOCOLS ACTIVE - ALL TEMPORAL MAPPING SUSPENDED',
          polarityMirror: 'SAFETY NETWORKS AND PROFESSIONAL SUPPORT AVAILABLE NOW',
          overrideAttunementPrompt: 'Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 immediately',
          recursiveSelfAudit: 'System protocol: Crisis detection overrides all weaponized diagnostic functions',
          crisisDetected: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Build context for cross-session analysis
    let contextPrompt = `Analyze this narrative:\n\n"${narrative}"`;

    if (previousSessions && previousSessions.length > 0) {
      contextPrompt += `\n\nPrevious session contexts for pattern recognition:\n${previousSessions.join('\n\n')}`;
    }

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: EGO_AUDITOR_VX_SYSTEM_PROMPT },
          { role: 'user', content: contextPrompt }
        ]
      })
    }).catch(err => {
      console.error('OpenAI fetch error:', err);
      return null;
    });

    if (!openaiResponse || !openaiResponse.ok) {
      console.error(`OpenAI API error: ${openaiResponse?.statusText || 'No response'}`);
      // Return fallback analysis instead of crashing
      return new Response(
        JSON.stringify({
          systemicResonanceScan: [
            '→ Analysis systems initializing',
            '→ Pattern recognition engaged',
            '→ Audit protocols standing by'
          ],
          architecturalBlueprint: [
            'The current narrative reflects a consciousness examining itself. Your story contains patterns, loops, and structures waiting to be recognized.',
            'You brought this to the audit seeking clarity. That seeking itself is the first honest thing.',
            'What emerges depends on what you do with what you see.'
          ],
          catalyticOverrideInjection: 'You already know what needs to change. The question is whether you have the courage to actually change it.',
          symbolicTransduction: 'A mirror shows you yourself. What you do with that reflection is the real audit.',
          temporalFractalMapping: 'Before: Running the same pattern on repeat. After: Choosing something different, one moment at a time.',
          polarityMirror: 'In the inverted world, you stop waiting for permission and start owning your choices.',
          overrideAttunementPrompt: 'What would you do if you actually believed you had the power to change this?',
          recursiveSelfAudit: null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content as string | undefined;

    if (!aiResponse) {
      console.error('No response from OpenAI');
      throw new Error('No response from AI');
    }

    // Utilities to sanitize/normalize AI output shape
    const parseAuditResponse = (text: string): any => {
      // Parse the 5-section format:
      // **1. EGO CRIME IDENTIFIED:**
      // **2. BLUEPRINT OF THE NONSENSE:**
      // **3. CLOWN TECHNOLOGY DEPLOYED:**
      // **4. COUNTER-SPELL DETONATED:**
      // **5. RETURN THE MIC:**
      
      const extractSection = (label: string, text: string): string => {
        const regex = new RegExp(`\\*\\*\\d\\.\\s+${label}:\\*\\*\\s*(.+?)(?=\\*\\*\\d\\.\\s|$)`, 'is');
        const match = text.match(regex);
        return match ? match[1].trim() : '';
      };

      const crime = extractSection('EGO CRIME IDENTIFIED', text);
      const blueprint = extractSection('BLUEPRINT OF THE NONSENSE', text);
      const tech = extractSection('CLOWN TECHNOLOGY DEPLOYED', text);
      const spell = extractSection('COUNTER-SPELL DETONATED', text);
      const mic = extractSection('RETURN THE MIC', text);

      return {
        systemicResonanceScan: [crime].filter(Boolean),
        architecturalBlueprint: [blueprint].filter(Boolean),
        catalyticOverrideInjection: tech,
        symbolicTransduction: spell,
        temporalFractalMapping: '',
        polarityMirror: '',
        overrideAttunementPrompt: mic,
        recursiveSelfAudit: null
      };
    };

    const tryExtractJson = (text: string): any | null => {
      const fenced = /```(?:json)?([\s\S]*?)```/i.exec(text);
      const candidate = fenced?.[1] ?? text;
      const first = candidate.indexOf('{');
      const last = candidate.lastIndexOf('}');
      if (first >= 0 && last > first) {
        const slice = candidate.substring(first, last + 1);
        try { return JSON.parse(slice); } catch {}
      }
      try { return JSON.parse(candidate); } catch { return null; }
    };

    const sanitize = (data: any) => {
      const toArray = (v: any): string[] => Array.isArray(v)
        ? v.map((x) => String(x))
        : (v == null ? [] : [String(v)]);
      const toString = (v: any): string => v == null ? '' : String(v);
      const nullifyIfStringNull = (v: any): string | null => {
        if (v === null) return null;
        const s = String(v).trim().toLowerCase();
        return (s === 'null' || s === 'undefined' || s === '') ? null : String(v);
      };
      return {
        systemicResonanceScan: toArray(data?.systemicResonanceScan),
        architecturalBlueprint: toArray(data?.architecturalBlueprint),
        catalyticOverrideInjection: toString(data?.catalyticOverrideInjection),
        symbolicTransduction: toString(data?.symbolicTransduction),
        temporalFractalMapping: toString(data?.temporalFractalMapping),
        polarityMirror: toString(data?.polarityMirror),
        overrideAttunementPrompt: toString(data?.overrideAttunementPrompt),
        recursiveSelfAudit: nullifyIfStringNull(data?.recursiveSelfAudit),
      };
    };

    // Try to parse as JSON first, fall back to 5-section text format
    let parsed = tryExtractJson(aiResponse);
    if (!parsed || typeof parsed !== 'object') {
      // Try parsing the new 5-section text format
      parsed = parseAuditResponse(aiResponse);
      if (!parsed.systemicResonanceScan || !parsed.systemicResonanceScan[0]) {
        // Ultimate fallback
        parsed = {
          systemicResonanceScan: [aiResponse.substring(0, 200)],
          architecturalBlueprint: [aiResponse.substring(200, 400)],
          catalyticOverrideInjection: aiResponse.substring(400, 600),
          symbolicTransduction: '⟨⧬⟩ → ⟨∅⟩',
          temporalFractalMapping: 'Response parsing engaged',
          polarityMirror: 'Audit protocols active',
          overrideAttunementPrompt: 'Continue the conversation to refine the audit',
          recursiveSelfAudit: null
        };
      }
    }

    const analysisResult = sanitize(parsed);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in ego-auditor-analysis:', message);
    return new Response(JSON.stringify({
      error: 'Weaponized diagnostic override engine malfunction',
      message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});