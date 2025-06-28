
import React, { useState, useEffect } from 'react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Database, AlertTriangle, CheckCircle } from 'lucide-react';

export const CodebaseAnalysis: React.FC = () => {
  const { runAnalysis, loading, results } = useAIAnalysis();
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Key files to analyze for IKANISA PWA
  const criticalFiles = [
    {
      name: 'Feed.tsx',
      type: 'component',
      description: 'Main feed displaying public baskets'
    },
    {
      name: 'BasketContext.tsx', 
      type: 'context',
      description: 'Basket state management'
    },
    {
      name: 'AuthContext.tsx',
      type: 'context', 
      description: 'Authentication flow with WhatsApp + Anonymous'
    },
    {
      name: 'ContributionPage.tsx',
      type: 'page',
      description: 'MoMo contribution flow'
    },
    {
      name: 'BasketWizard.tsx',
      type: 'wizard',
      description: 'Basket creation flow'
    }
  ];

  const runComprehensiveAnalysis = async () => {
    console.log('🔍 Starting comprehensive IKANISA codebase analysis...');
    
    // 1. Code Review Analysis
    for (const file of criticalFiles) {
      await runAnalysis('code_review', {
        code: `// Analyzing ${file.name} - ${file.description}`,
        language: 'typescript',
        component: file.name,
        context: 'IKANISA PWA - Sub-Saharan mobile money platform'
      });
    }

    // 2. Schema Optimization for Mobile Money
    await runAnalysis('schema_optimization', {
      schema: 'countries table with dual mobile money providers',
      tables: [
        {
          name: 'countries',
          columns: ['code', 'name', 'currency', 'p1_name', 'p1_service', 'p1_send_money', 'p1_pay_bill', 'p2_name', 'p2_service', 'p2_send_money', 'p2_pay_bill']
        },
        {
          name: 'contributions', 
          columns: ['id', 'basket_id', 'user_id', 'amount_local', 'amount_usd', 'currency', 'momo_code', 'payment_method', 'confirmed']
        },
        {
          name: 'wallets',
          columns: ['id', 'user_id', 'balance_usd', 'last_updated']
        }
      ],
      context: 'Mobile money USSD patterns for 34 Sub-Saharan countries'
    });

    // 3. Error Analysis for Authentication Flow
    await runAnalysis('error_analysis', {
      error: 'Authentication limbo states in WhatsApp login',
      stackTrace: 'Users stuck between anonymous and authenticated states',
      context: 'IKANISA WhatsApp authentication with Supabase',
      codeSnippet: 'Auth flow supporting both anonymous contributions and WhatsApp login for basket creation'
    });

    // 4. Accessibility Check for Mobile-First PWA
    await runAnalysis('accessibility', {
      component: 'IKANISA PWA Mobile Interface',
      htmlContent: 'Mobile-first PWA for Sub-Saharan Africa with USSD integration',
      analysisType: 'mobile_accessibility'
    });

    // 5. Refactor Analysis for User Flows
    await runAnalysis('refactor', {
      codeFiles: [
        { name: 'Feed.tsx', type: 'main_feed' },
        { name: 'ContributionPage.tsx', type: 'payment_flow' },
        { name: 'BasketWizard.tsx', type: 'creation_flow' }
      ],
      targetFramework: 'react',
      refactorType: 'user_flow_optimization'
    });

    setAnalysisComplete(true);
    console.log('✅ Comprehensive analysis complete');
  };

  const getAnalysisSummary = () => {
    const codeReviews = results.filter(r => r.type === 'code_review');
    const schemaAnalysis = results.filter(r => r.type === 'schema_optimization');
    const errorAnalysis = results.filter(r => r.type === 'error_analysis');
    const accessibilityChecks = results.filter(r => r.type === 'accessibility');
    const refactorSuggestions = results.filter(r => r.type === 'refactor');

    return {
      totalAnalyses: results.length,
      codeReviews: codeReviews.length,
      schemaOptimizations: schemaAnalysis.length,
      errorAnalyses: errorAnalysis.length,
      accessibilityChecks: accessibilityChecks.length,
      refactorSuggestions: refactorSuggestions.length,
      averageConfidence: results.reduce((acc, r) => acc + r.confidence, 0) / results.length || 0
    };
  };

  const summary = getAnalysisSummary();

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            IKANISA Codebase Analysis Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runComprehensiveAnalysis}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Analyzing...' : 'Run Full Analysis'}
            </Button>
            {analysisComplete && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Analysis Complete
              </Badge>
            )}
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Code className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{summary.codeReviews}</div>
                  <div className="text-sm text-gray-600">Code Reviews</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Database className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{summary.schemaOptimizations}</div>
                  <div className="text-sm text-gray-600">Schema Analysis</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{summary.errorAnalyses}</div>
                  <div className="text-sm text-gray-600">Error Analysis</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="code">Code Quality</TabsTrigger>
              <TabsTrigger value="schema">Database</TabsTrigger>
              <TabsTrigger value="flows">User Flows</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Total Analyses:</strong> {summary.totalAnalyses}</p>
                    <p><strong>Average Confidence:</strong> {(summary.averageConfidence * 100).toFixed(1)}%</p>
                    <p><strong>Critical Files Analyzed:</strong> {criticalFiles.length}</p>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Key Focus Areas:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Anonymous user contribution flows</li>
                        <li>WhatsApp authentication integration</li>
                        <li>Mobile money USSD pattern implementation</li>
                        <li>USD-pegged wallet with local currency display</li>
                        <li>Sub-Saharan Africa localization</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              {results.filter(r => r.type === 'code_review').map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">Code Review Results</CardTitle>
                    <Badge variant={analysis.confidence > 0.8 ? 'default' : 'secondary'}>
                      Confidence: {(analysis.confidence * 100).toFixed(1)}%
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">
                      {JSON.stringify(analysis.result, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="schema" className="space-y-4">
              {results.filter(r => r.type === 'schema_optimization').map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">Database Schema Analysis</CardTitle>
                    <Badge variant={analysis.confidence > 0.8 ? 'default' : 'secondary'}>
                      Confidence: {(analysis.confidence * 100).toFixed(1)}%
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">
                      {JSON.stringify(analysis.result, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="flows" className="space-y-4">
              {results.filter(r => r.type === 'refactor' || r.type === 'accessibility').map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {analysis.type === 'refactor' ? 'User Flow Analysis' : 'Accessibility Analysis'}
                    </CardTitle>
                    <Badge variant={analysis.confidence > 0.8 ? 'default' : 'secondary'}>
                      Confidence: {(analysis.confidence * 100).toFixed(1)}%
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">
                      {JSON.stringify(analysis.result, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
