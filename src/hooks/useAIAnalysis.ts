
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AIAnalysisOptions {
  code?: string;
  language?: string;
  schema?: string;
  tables?: any[];
  component?: string;
  htmlContent?: string;
  error?: string;
  stackTrace?: string;
  context?: string;
  codeSnippet?: string;
  codeFiles?: any[];
  targetFramework?: string;
  [key: string]: any; // Add index signature for JSON compatibility
}

export interface AIAnalysisResult {
  id: string;
  type: string;
  result: any;
  timestamp: string;
  confidence: number;
  status: 'success' | 'error';
}

export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIAnalysisResult[]>([]);
  const { toast } = useToast();

  const runAnalysis = useCallback(async (
    type: 'code_review' | 'schema_optimization' | 'accessibility' | 'error_analysis' | 'refactor',
    options: AIAnalysisOptions
  ): Promise<AIAnalysisResult | null> => {
    setLoading(true);
    
    try {
      const functionMap = {
        code_review: 'ai-code-review',
        schema_optimization: 'ai-schema-optimizer',
        accessibility: 'ai-accessibility-checker',
        error_analysis: 'ai-error-analyzer',
        refactor: 'ai-refactor-assistant'
      };

      const { data, error } = await supabase.functions.invoke(functionMap[type], {
        body: options
      });

      if (error) {
        throw new Error(error.message);
      }

      const result: AIAnalysisResult = {
        id: crypto.randomUUID(),
        type,
        result: data,
        timestamp: new Date().toISOString(),
        confidence: data.summary?.averageConfidence || data.summary?.confidence || 0.5,
        status: 'success'
      };

      setResults(prev => [result, ...prev]);
      
      // Store in database for persistence - fix the insert data structure
      const { error: insertError } = await supabase.from('ai_suggestions').insert({
        suggestion_type: type,
        ai_model: 'multi-model',
        input_data: options as any, // Cast to any for JSON compatibility
        suggestion_content: data as any, // Cast to any for JSON compatibility
        confidence_score: result.confidence,
        status: 'pending'
      });

      if (insertError) {
        console.error('Failed to store AI suggestion:', insertError);
      }

      toast({
        title: `${type.replace('_', ' ')} Complete`,
        description: `Analysis completed successfully`
      });

      return result;
    } catch (error: any) {
      const errorResult: AIAnalysisResult = {
        id: crypto.randomUUID(),
        type,
        result: { error: error.message },
        timestamp: new Date().toISOString(),
        confidence: 0,
        status: 'error'
      };

      setResults(prev => [errorResult, ...prev]);
      
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive"
      });

      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const getResultsByType = useCallback((type: string) => {
    return results.filter(result => result.type === type);
  }, [results]);

  return {
    loading,
    results,
    runAnalysis,
    clearResults,
    getResultsByType
  };
};
