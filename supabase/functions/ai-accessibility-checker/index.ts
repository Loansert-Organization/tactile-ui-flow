
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
    const { component, htmlContent, analysisType = 'comprehensive' } = await req.json();
    
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const claudeKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!geminiKey || !claudeKey) {
      return new Response(JSON.stringify({ 
        error: 'Missing API keys for accessibility analysis.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Gemini for accessibility analysis
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this React component for accessibility issues:
            
            Component: ${component}
            HTML Content: ${htmlContent}
            
            Check for:
            - ARIA labels and roles
            - Color contrast ratios
            - Keyboard navigation
            - Screen reader compatibility
            - Touch target sizes
            - Focus management
            
            Return JSON: { accessibility_score: 0-100, issues: [], recommendations: [], wcag_compliance: [], confidence: 0.0-1.0 }`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1200
        }
      }),
    });

    // Claude for UX analysis
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Analyze this React component for user experience and mobile responsiveness:
            
            Component: ${component}
            
            Return JSON: { ux_score: 0-100, mobile_issues: [], usability_recommendations: [], performance_notes: [], confidence: 0.0-1.0 }`
          }
        ]
      }),
    });

    const [geminiData, claudeData] = await Promise.all([
      geminiResponse.json(),
      claudeResponse.json()
    ]);

    const geminiAnalysis = JSON.parse(geminiData.candidates[0].content.parts[0].text);
    const claudeAnalysis = JSON.parse(claudeData.content[0].text);

    const combinedAnalysis = {
      accessibility: geminiAnalysis,
      ux: claudeAnalysis,
      summary: {
        overallScore: Math.round((geminiAnalysis.accessibility_score + claudeAnalysis.ux_score) / 2),
        totalIssues: geminiAnalysis.issues.length + claudeAnalysis.mobile_issues.length,
        criticalIssues: geminiAnalysis.issues.filter(issue => issue.severity === 'critical').length,
        averageConfidence: (geminiAnalysis.confidence + claudeAnalysis.confidence) / 2
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(combinedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ai-accessibility-checker:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
