
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { error, stackTrace, context, codeSnippet } = await req.json();
    
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const claudeKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!openaiKey || !claudeKey) {
      return new Response(JSON.stringify({ 
        error: 'Missing API keys for error analysis.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GPT-4o for error analysis and solutions
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert debugger. Analyze the error and provide:
            - Root cause analysis
            - Step-by-step solution
            - Prevention strategies
            - Code examples if needed
            Return JSON: { root_cause, solution_steps: [], prevention_tips: [], code_fix: "", confidence: 0.0-1.0 }`
          },
          { 
            role: 'user', 
            content: `Error: ${error}\nStack Trace: ${stackTrace}\nContext: ${context}\nCode: ${codeSnippet}` 
          }
        ],
        temperature: 0.1
      }),
    });

    // Claude for alternative solutions and best practices
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1200,
        messages: [
          {
            role: 'user',
            content: `Analyze this error and provide alternative solutions and best practices:
            
            Error: ${error}
            Stack Trace: ${stackTrace}
            Context: ${context}
            Code: ${codeSnippet}
            
            Return JSON: { alternative_solutions: [], best_practices: [], similar_errors: [], refactoring_suggestions: [], confidence: 0.0-1.0 }`
          }
        ]
      }),
    });

    const [gptData, claudeData] = await Promise.all([
      gptResponse.json(),
      claudeResponse.json()
    ]);

    const gptAnalysis = JSON.parse(gptData.choices[0].message.content);
    const claudeAnalysis = JSON.parse(claudeData.content[0].text);

    const combinedAnalysis = {
      primary_solution: gptAnalysis,
      alternatives: claudeAnalysis,
      summary: {
        error_category: this.categorizeError(error),
        severity: this.assessSeverity(error, stackTrace),
        estimated_fix_time: this.estimateFixTime(gptAnalysis.solution_steps.length),
        confidence: (gptAnalysis.confidence + claudeAnalysis.confidence) / 2
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(combinedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ai-error-analyzer:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper functions would be defined here
function categorizeError(error: string): string {
  if (error.includes('TypeError')) return 'type_error';
  if (error.includes('ReferenceError')) return 'reference_error';
  if (error.includes('SyntaxError')) return 'syntax_error';
  if (error.includes('network') || error.includes('fetch')) return 'network_error';
  if (error.includes('auth') || error.includes('permission')) return 'auth_error';
  return 'unknown';
}

function assessSeverity(error: string, stackTrace: string): string {
  if (error.includes('critical') || stackTrace.includes('crash')) return 'critical';
  if (error.includes('warning') || error.includes('deprecated')) return 'low';
  return 'medium';
}

function estimateFixTime(solutionSteps: number): string {
  if (solutionSteps <= 2) return '5-15 minutes';
  if (solutionSteps <= 4) return '15-30 minutes';
  return '30+ minutes';
}
