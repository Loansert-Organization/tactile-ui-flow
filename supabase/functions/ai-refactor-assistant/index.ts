
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
    const { codeFiles, refactorType = 'comprehensive', targetFramework = 'react' } = await req.json();
    
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const claudeKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!openaiKey || !claudeKey) {
      return new Response(JSON.stringify({ 
        error: 'Missing API keys for refactoring analysis.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GPT-4o for code refactoring suggestions
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
            content: `You are a senior software architect. Analyze the code for refactoring opportunities:
            - Component decomposition
            - Code duplication removal
            - Performance optimizations
            - Design pattern improvements
            - Hook extraction opportunities
            Return JSON: { refactoring_plan: [], code_improvements: [], performance_gains: [], maintainability_score: 0-100, confidence: 0.0-1.0 }`
          },
          { 
            role: 'user', 
            content: `Analyze these ${targetFramework} files for refactoring:\n${JSON.stringify(codeFiles, null, 2)}` 
          }
        ],
        temperature: 0.2
      }),
    });

    // Claude for architectural improvements
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
            content: `Analyze this ${targetFramework} codebase for architectural improvements:
            
            ${JSON.stringify(codeFiles, null, 2)}
            
            Focus on:
            - Separation of concerns
            - State management patterns
            - Component hierarchy optimization
            - Custom hook opportunities
            - Reusable utility functions
            
            Return JSON: { architecture_recommendations: [], state_management_improvements: [], reusability_opportunities: [], testing_recommendations: [], confidence: 0.0-1.0 }`
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
      refactoring: gptAnalysis,
      architecture: claudeAnalysis,
      summary: {
        totalImprovements: gptAnalysis.code_improvements.length + claudeAnalysis.architecture_recommendations.length,
        estimatedImpact: this.calculateImpact(gptAnalysis.maintainability_score),
        priorityLevel: this.determinePriority(gptAnalysis.refactoring_plan.length),
        averageConfidence: (gptAnalysis.confidence + claudeAnalysis.confidence) / 2
      },
      implementation_roadmap: this.generateRoadmap(gptAnalysis.refactoring_plan, claudeAnalysis.architecture_recommendations),
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(combinedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ai-refactor-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper functions
function calculateImpact(maintainabilityScore: number): string {
  if (maintainabilityScore < 60) return 'high';
  if (maintainabilityScore < 80) return 'medium';
  return 'low';
}

function determinePriority(refactoringTasks: number): string {
  if (refactoringTasks > 10) return 'critical';
  if (refactoringTasks > 5) return 'high';
  return 'medium';
}

function generateRoadmap(refactoringPlan: any[], architectureRecommendations: any[]): any[] {
  const allTasks = [...refactoringPlan, ...architectureRecommendations];
  return allTasks.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });
}
