
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
    const { schema, tables, analysisType = 'optimization' } = await req.json();
    
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const claudeKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!openaiKey || !claudeKey) {
      return new Response(JSON.stringify({ 
        error: 'Missing API keys for schema analysis.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GPT-4o for schema optimization
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
            content: `You are a database architect expert. Analyze the PostgreSQL schema for:
            - Index optimization opportunities
            - Foreign key relationships
            - Performance bottlenecks
            - Data normalization issues
            - Security (RLS) recommendations
            Return JSON: { analysis, optimizations: [], security_issues: [], performance_recommendations: [], confidence: 0.0-1.0 }`
          },
          { role: 'user', content: `Schema: ${schema}\nTables: ${JSON.stringify(tables)}` }
        ],
        temperature: 0.2
      }),
    });

    // Claude for RLS and security analysis
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: `Analyze this PostgreSQL schema for Row-Level Security (RLS) policies and security vulnerabilities:
            
            Schema: ${schema}
            Tables: ${JSON.stringify(tables)}
            
            Return JSON: { security_analysis, rls_recommendations: [], vulnerabilities: [], best_practices: [], confidence: 0.0-1.0 }`
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
      optimization: gptAnalysis,
      security: claudeAnalysis,
      summary: {
        totalOptimizations: gptAnalysis.optimizations.length,
        securityIssues: claudeAnalysis.vulnerabilities.length,
        performanceRecommendations: gptAnalysis.performance_recommendations.length,
        averageConfidence: (gptAnalysis.confidence + claudeAnalysis.confidence) / 2
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(combinedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ai-schema-optimizer:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
