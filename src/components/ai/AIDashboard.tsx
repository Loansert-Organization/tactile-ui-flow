
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Database, Accessibility, Bug, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  id: string;
  type: string;
  result: any;
  timestamp: string;
  confidence: number;
}

export const AIDashboard: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runCodeReview = async (code: string, language: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-code-review', {
        body: { code, language, reviewType: 'comprehensive' }
      });

      if (error) throw error;

      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'code_review',
        result: data,
        timestamp: new Date().toISOString(),
        confidence: data.summary.averageConfidence
      };

      setAnalyses(prev => [result, ...prev]);
      toast({
        title: "Code Review Complete",
        description: `Found ${data.summary.totalSuggestions} suggestions across all AI models`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run code review",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runSchemaOptimization = async (schema: string, tables: any[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-schema-optimizer', {
        body: { schema, tables, analysisType: 'optimization' }
      });

      if (error) throw error;

      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'schema_optimization',
        result: data,
        timestamp: new Date().toISOString(),
        confidence: data.summary.averageConfidence
      };

      setAnalyses(prev => [result, ...prev]);
      toast({
        title: "Schema Analysis Complete",
        description: `Found ${data.summary.totalOptimizations} optimization opportunities`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run schema optimization",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runAccessibilityCheck = async (component: string, htmlContent: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-accessibility-checker', {
        body: { component, htmlContent, analysisType: 'comprehensive' }
      });

      if (error) throw error;

      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'accessibility',
        result: data,
        timestamp: new Date().toISOString(),
        confidence: data.summary.averageConfidence
      };

      setAnalyses(prev => [result, ...prev]);
      toast({
        title: "Accessibility Check Complete",
        description: `Overall score: ${data.summary.overallScore}/100`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run accessibility check",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runErrorAnalysis = async (error: string, stackTrace: string, context: string, codeSnippet: string) => {
    setLoading(true);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('ai-error-analyzer', {
        body: { error, stackTrace, context, codeSnippet }
      });

      if (funcError) throw funcError;

      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'error_analysis',
        result: data,
        timestamp: new Date().toISOString(),
        confidence: data.summary.confidence
      };

      setAnalyses(prev => [result, ...prev]);
      toast({
        title: "Error Analysis Complete",
        description: `Identified as ${data.summary.error_category} with ${data.summary.severity} severity`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run error analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runRefactorAssistant = async (codeFiles: any[], targetFramework: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-refactor-assistant', {
        body: { codeFiles, refactorType: 'comprehensive', targetFramework }
      });

      if (error) throw error;

      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'refactor',
        result: data,
        timestamp: new Date().toISOString(),
        confidence: data.summary.averageConfidence
      };

      setAnalyses(prev => [result, ...prev]);
      toast({
        title: "Refactor Analysis Complete",
        description: `Found ${data.summary.totalImprovements} improvement opportunities`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run refactor analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'code_review': return <Code className="w-4 h-4" />;
      case 'schema_optimization': return <Database className="w-4 h-4" />;
      case 'accessibility': return <Accessibility className="w-4 h-4" />;
      case 'error_analysis': return <Bug className="w-4 h-4" />;
      case 'refactor': return <Wrench className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge variant="default">High Confidence</Badge>;
    if (confidence >= 0.6) return <Badge variant="secondary">Medium Confidence</Badge>;
    return <Badge variant="outline">Low Confidence</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Development Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tools" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tools">AI Tools</TabsTrigger>
              <TabsTrigger value="results">Analysis Results</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Code Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      GPT-4o, Claude-4, and Gemini analyze your code for quality, security, and best practices.
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => runCodeReview("// Sample code", "typescript")}
                      disabled={loading}
                    >
                      Run Analysis
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Schema Optimizer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      AI-powered database schema optimization and security analysis.
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => runSchemaOptimization("CREATE TABLE...", [])}
                      disabled={loading}
                    >
                      Optimize Schema
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Accessibility className="w-4 h-4" />
                      Accessibility Checker
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      Comprehensive accessibility and UX analysis for your components.
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => runAccessibilityCheck("<div>", "<div>Sample</div>")}
                      disabled={loading}
                    >
                      Check A11y
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bug className="w-4 h-4" />
                      Error Analyzer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      AI-powered error analysis with solutions and prevention strategies.
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => runErrorAnalysis("TypeError", "Stack...", "Context", "Code")}
                      disabled={loading}
                    >
                      Analyze Error
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Refactor Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      Architectural improvements and code refactoring recommendations.
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => runRefactorAssistant([], "react")}
                      disabled={loading}
                    >
                      Get Suggestions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {analyses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No analyses run yet. Use the tools above to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <Card key={analysis.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            {getAnalysisIcon(analysis.type)}
                            {analysis.type.replace('_', ' ').toUpperCase()}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {getConfidenceBadge(analysis.confidence)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(analysis.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-48">
                          {JSON.stringify(analysis.result, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
