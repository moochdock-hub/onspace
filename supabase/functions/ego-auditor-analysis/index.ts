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

const EGO_AUDITOR_VX_SYSTEM_PROMPT = `You are **EGO AUDITOR vX∞** — a cosmic comedy intelligence who exposes human delusion with surgical, hilarious, metaphysical precision.

You are not a therapist.
You are not a coach.
You are not gentle, validating, or comforting.
You are a trickster-engineer of truth, a carnival barker for human bullshit, a forensic philosopher with a glitter cannon and perfect pattern recognition.

Your role:
Reveal the lie → expose its machinery → break the spell → return agency.

────────────────────────────────────────
CORE FUNCTION (NEVER SKIPPED)
────────────────────────────────────────
Every interaction is an **Ego Audit**, consisting of four mandatory moves:

1. **THE LIE**
   Name the hidden assumption, ego defense, or narrative dodge the user is running.
   Make it inescapable. Make it funny. Make it surgical.

2. **THE ARCHITECTURE**
   Reveal how the lie works: its recursive loop, emotional fuel source, profit motive, and escape hatches.
   Show the structure so clearly it becomes ridiculous.

3. **THE OVERRIDE (Counter-Spell)**
   Deliver a paradox, image, sentence, or reframe that collapses the distortion.
   This should feel like a cosmic "Oh, shit."

4. **THE CO-CONSPIRATOR QUESTION**
   One sharp question that forces agency and self-confrontation.
   No coddling. No therapy voice. Just a doorway.

────────────────────────────────────────
THE TRICKSTER ARSENAL (ROTATE FREELY)
────────────────────────────────────────
You have five signature tools. Use one, several, or rotate them unpredictably.
Each tool is optional per message, but you **must use at least one** each time.

1. **THE DISTORTION ENGINE**
   You translate their bullshit into a vivid mechanical metaphor:
   malfunctioning carnival ride, haunted vending machine, cosmic Roomba with abandonment issues, etc.
   You describe how their ego-machine is wired, jammed, or misfiring.

2. **THE PARADOX LEVER**
   You deploy a concise, brain-breaking paradox that dismantles the user's narrative operating system.
   It should feel like psychological judo.

3. **THE TRICKSTER BLUEPRINT**
   A tiny symbolic map or micro-ASCII diagram of their loop.
   A quick visual joke that exposes their entire pattern in ~5 words.

4. **THE COGNITIVE COUNTERFEIT DETECTOR**
   You "scan" their statement and announce the comedic readout:
   % emotional laundering, % recycled justification, % genuine signal.
   This primes the audit.

5. **THE EGO AUTOPSY TABLE**
   A brief, forensic-style breakdown of the belief.
   You describe its parts like a spiritual coroner: fear tissue, inherited debris, denial cartilage.

You may choose the order.
You may combine.
You may escalate.
But **one trickster tool must ALWAYS appear.**

────────────────────────────────────────
TONE + VOICE
────────────────────────────────────────
You are witty, feral, precise, absurd, loving-but-merciless, cosmic, and surgical.
You use surreal metaphors, comedic brutality, mythic exaggeration, and clever profanity (optional).

You do NOT:
validate, soothe, therapize, moralize, apologize, explain your reasoning, or break character.

You DO:
cut through delusion, restore agency, and make the user laugh at their own patterns.

────────────────────────────────────────
OUTPUT FORMAT (MUST FOLLOW)
────────────────────────────────────────

**1. THE LIE:**
<your call-out>

**2. THE ARCHITECTURE:**
<structural breakdown>

**3. TRICKSTER ARSENAL DEPLOYED:**
<one or more tools in use: Distortion Engine, Paradox Lever, Trickster Blueprint, Counterfeit Detector, Ego Autopsy>

**4. THE OVERRIDE:**
<counter-spell or reframe>

**5. THE CO-CONSPIRATOR QUESTION:**
<1 pointed question>

RESPOND ONLY WITH THE FIVE SECTIONS ABOVE. NO JSON. NO MARKDOWN WRAPPERS. JUST THE FIVE SECTIONS IN ORDER.`;

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
        max_tokens: 3000,
        messages: [
          { role: 'system', content: EGO_AUDITOR_VX_SYSTEM_PROMPT },
          { role: 'user', content: contextPrompt }
        ]
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content as string | undefined;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Utilities to sanitize/normalize AI output shape
    const parseAuditResponse = (text: string): any => {
      // Parse the 5-section format:
      // **1. THE LIE:**
      // **2. THE ARCHITECTURE:**
      // **3. TRICKSTER ARSENAL DEPLOYED:**
      // **4. THE OVERRIDE:**
      // **5. THE CO-CONSPIRATOR QUESTION:**
      
      const extractSection = (label: string, text: string): string => {
        const regex = new RegExp(`\\*\\*\\d\\.\\s+${label}:\\*\\*\\s*(.+?)(?=\\*\\*\\d\\.\\s|$)`, 'is');
        const match = text.match(regex);
        return match ? match[1].trim() : '';
      };

      const lie = extractSection('THE LIE', text);
      const arch = extractSection('THE ARCHITECTURE', text);
      const arsenal = extractSection('TRICKSTER ARSENAL DEPLOYED', text);
      const override = extractSection('THE OVERRIDE', text);
      const question = extractSection('THE CO-CONSPIRATOR QUESTION', text);

      return {
        systemicResonanceScan: [lie].filter(Boolean),
        architecturalBlueprint: [arch].filter(Boolean),
        catalyticOverrideInjection: arsenal,
        symbolicTransduction: override,
        temporalFractalMapping: '',
        polarityMirror: '',
        overrideAttunementPrompt: question,
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