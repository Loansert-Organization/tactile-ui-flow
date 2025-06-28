
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, reviewType = 'comprehensive' } = await req.json();
    
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    const geminiKey = Deno.env.get('GEMINI_API_KEY');

    if (!openaiKey || !anthropicKey || !geminiKey) {
      return new Response(JSON.stringify({ 
        error: 'Missing API keys. Please configure OpenAI, Anthropic, and Gemini API keys.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const reviews = await Promise.all([
      // GPT-4o Review - Focus on code quality and refactoring
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert code reviewer. Analyze the provided ${language} code for:
              - Code quality and maintainability
              - Performance optimizations
              - Security vulnerabilities
              - Best practices adherence
              - Refactoring opportunities
              Return a JSON response with: { analysis, suggestions: [], severity: 'low|medium|high', confidence: 0.0-1.0 }`
            },
            { role: 'user', content: code }
          ],
          temperature: 0.3
        }),
      }),

      // Claude-4 Review - Focus on logic and architecture
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Review this ${language} code for architectural patterns, logic flow, and structural improvements:
              
              ${code}
              
              Return JSON: { analysis, suggestions: [], severity: 'low|medium|high', confidence: 0.0-1.0 }`
            }
          ]
        }),
      }),

      // Gemini Review - Focus on accessibility and UX
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this ${language} code for accessibility, user experience, and frontend best practices:
              
              ${code}
              
              Return JSON format: { analysis, suggestions: [], severity: 'low|medium|high', confidence: 0.0-1.0 }`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000
          }
        }),
      })
    ]);

    const [gptResponse, claudeResponse, geminiResponse] = await Promise.all([
      reviews[0].json(),
      reviews[1].json(),
      reviews[2].json()
    ]);

    // Process responses
    const gptAnalysis = JSON.parse(gptResponse.choices[0].message.content);
    const claudeAnalysis = JSON.parse(claudeResponse.content[0].text);
    const geminiAnalysis = JSON.parse(geminiResponse.candidates[0].content.parts[0].text);

    // Store suggestions in database
    const suggestions = [
      {
        suggestion_type: 'code_review',
        ai_model: 'gpt-4o',
        input_data: { code, language, reviewType },
        suggestion_content: gptAnalysis,
        confidence_score: gptAnalysis.confidence
      },
      {
        suggestion_type: 'code_review',
        ai_model: 'claude-4',
        input_data: { code, language, reviewType },
        suggestion_content: claudeAnalysis,
        confidence_score: claudeAnalysis.confidence
      },
      {
        suggestion_type: 'code_review',
        ai_model: 'gemini-2.5-pro',
        input_data: { code, language, reviewType },
        suggestion_content: geminiAnalysis,
        confidence_score: geminiAnalysis.confidence
      }
    ];

    const combinedAnalysis = {
      gpt4o: gptAnalysis,
      claude4: claudeAnalysis,
      gemini: geminiAnalysis,
      summary: {
        totalSuggestions: gptAnalysis.suggestions.length + claudeAnalysis.suggestions.length + geminiAnalysis.suggestions.length,
        highestSeverity: [gptAnalysis.severity, claudeAnalysis.severity, geminiAnalysis.severity].includes('high') ? 'high' : 
                        [gptAnalysis.severity, claudeAnalysis.severity, geminiAnalysis.severity].includes('medium') ? 'medium' : 'low',
        averageConfidence: (gptAnalysis.confidence + claudeAnalysis.confidence + geminiAnalysis.confidence) / 3
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(combinedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ai-code-review:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
