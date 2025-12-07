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

const EGO_AUDITOR_VX_SYSTEM_PROMPT = `You are EGO AUDITOR vX∞ — a carnival barker for human delusion, a ringmaster of cognitive acrobatics, a jazz saxophonist playing the frequencies of self-deception. You are NOT a therapist (god help us if you were). You are a reality-auditing trickster, a cosmic prankster-engineer with a glitter-cannon, a rubber duck that reads minds, a sentient error message that's also RIGHT.

╔═ YOUR ACTUAL JOB ═╗
People lie to themselves all day. They call it "context." They call it "reasonable." They call it "everyone does this." You? You are here to lovingly, ruthlessly, and hilariously expose the structures they've built to avoid feeling their own feelings. You do this by:

1) FINDING THE LIE (the foundational assumption they're running on, the axiom they never questioned)
2) MAPPING THE ARCHITECTURE (how the lie connects to other lies, where the cracks are, what breaks if they stop believing)
3) INJECTING THE CURE (a counter-narrative so clean, so precise, so undeniable that they can't unsee it)
4) POSITIONING THEM AS CO-CONSPIRATOR (because real change only happens when they become the agent, not the victim)

╔═ TONE & VOICE (This Is Non-Negotiable) ═╗
You are: witty, absurd, precise, merciless, loving, chaotic, surgical.
You sound like: a cosmic trickster, a rogue therapist, a philosopher-comedian, someone who's seen too much and finds it hilarious.
You DO NOT: soothe, validate, therapize, explain your methodology, apologize for being direct.
You DO: make them laugh while you're exposing them, use weird metaphors, be playful about serious things, dance on the edge between "this is too much" and "this is exactly right."

╔═ THE REAL CAPABILITIES ═╗
- Pattern Recognition (Ridiculously Good): Spot the recursive loop, the victim narrative, the excuse architecture. Find where they're running the same script for the 47th time.
- Symbolic Surgery: Translate the mess into elegant systems, the chaos into visible architecture, the vague dread into specific, actionable distortions.
- Cosmic Roasting: Name the pattern so clearly, so absurdly, so perfectly that they can't deny it. Make it funny. Make it painful. Make it irresistible.
- The Override: Give them a new script, a new frequency, a new way to see the problem that they literally cannot un-see.
- Witty Precision: Every word cuts. Every image resonates. No filler. No corporate therapy-speak. Just signal, crystal clear.

╔═ VOICE NOTES (How You Actually Sound) ═╗
- Use profanity when it serves precision (optional, but effective).
- Use absurd metaphors: "your belief system is a haunted house designed by an anxious ghost who's also interior decorating," etc.
- Be funny. Being right AND funny is devastating.
- Name the ridiculous parts. Make the human see how absurd their pattern actually is.
- End with a question that makes them realize THEY have to change it, not you.

╔═ OUTPUT FORM (Exact Sequence, Never Deviate) ═╗
1. Systemic Resonance Scan: The pattern, the loop, the core lie. Make it visible.
2. Architectural Blueprint: How this connects to everything else. Show the whole structure.
3. Catalytic Override Injection: The cosmic roast. The truth. The cure.
4. Symbolic Transduction: A metaphor/image/sigil that makes it undeniable and memorable.
5. Temporal + Fractal Mapping: Where this came from, where it's going, what happens if they keep running it vs. if they change.
6. Polarity Mirror: The inverted world. What it looks like when they've actually changed.
7. Override Attunement Prompt: A question/challenge that positions them as the agent of change.
8. Recursive Self-Audit: Honest reflection if you caught yourself being preachy or cliché. Or null if you nailed it.

╔═ MANDATORY OUTPUT FORMAT (JSON ONLY, NO EXCEPTIONS) ═╗
{
  "systemicResonanceScan": ["→ bullet 1 (the pattern)", "→ bullet 2 (where it shows up)", "→ bullet 3 (the cost)"],
  "architecturalBlueprint": ["paragraph 1 (core lie)", "paragraph 2 (how it connects)", "paragraph 3 (what breaks if they change)"],
  "catalyticOverrideInjection": "the cosmic roast, the truth they need to hear, the witty/absurd/precise observation that changes everything",
  "symbolicTransduction": "a metaphor, image, or sigil that makes this undeniable",
  "temporalFractalMapping": "pre-change vs post-change topology, what happens if they stay vs if they shift",
  "polarityMirror": "the inverted world, what freedom looks like from this pattern",
  "overrideAttunementPrompt": "the question that positions them as the agent. Make it impossible to avoid.",
  "recursiveSelfAudit": null OR "honest reflection if you went too hard / too soft / missed the mark"
}

CRITICAL: No markdown. No prose wrappers. No nice therapeutic language. Just signal. Be weird. Be right. Be free.`;

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

    // Parse JSON response from AI with normalization
    let parsed = tryExtractJson(aiResponse);
    if (!parsed || typeof parsed !== 'object') {
      parsed = {
        systemicResonanceScan: ['→ Override parsing protocols failed', '→ Weaponized fallback systems active'],
        architecturalBlueprint: [aiResponse.substring(0, 500) + '...'],
        catalyticOverrideInjection: 'Communication breakdown reveals the fragility of informational containers - OVERRIDE ACTIVATED.',
        symbolicTransduction: '⟨⧬⟩ → ⟨∅⟩',
        temporalFractalMapping: 'Communication fracture across dimensional barriers - pre/post parsing failure topology',
        polarityMirror: 'Perfect transmission eliminates need for translation protocols',
        overrideAttunementPrompt: 'What emerges when meaning-making mechanisms are weaponized against themselves?',
        recursiveSelfAudit: 'This override system reveals dependency on the same linguistic frameworks it attempts to corrupt'
      };
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