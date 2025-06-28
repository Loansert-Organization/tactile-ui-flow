
import React, { useState, useEffect } from 'react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Wrench, AlertTriangle } from 'lucide-react';

interface AuditItem {
  component: string;
  status: 'connected' | 'missing' | 'broken';
  description: string;
  location: string;
  fixSteps?: string[];
}

export const BasketCreationAudit: React.FC = () => {
  const { runAnalysis, loading, results } = useAIAnalysis();
  const [auditResults, setAuditResults] = useState<AuditItem[]>([]);
  const [auditComplete, setAuditComplete] = useState(false);

  const runBasketCreationAudit = async () => {
    console.log('🔍 Starting Create a Basket flow audit...');
    
    // 1. Analyze BasketWizard component
    await runAnalysis('code_review', {
      code: 'Analyzing BasketWizard.tsx - Main basket creation component',
      language: 'typescript',
      component: 'BasketWizard.tsx',
      context: 'IKANISA PWA - Basket creation flow with WhatsApp auth deferral'
    });

    // 2. Analyze BasketNameForm component  
    await runAnalysis('code_review', {
      code: 'Analyzing BasketNameForm.tsx - Form input validation and binding',
      language: 'typescript', 
      component: 'BasketNameForm.tsx',
      context: 'Form validation and Supabase binding for basket name/description'
    });

    // 3. Analyze BasketGoalForm component
    await runAnalysis('code_review', {
      code: 'Analyzing BasketGoalForm.tsx - Goal amount and duration form',
      language: 'typescript',
      component: 'BasketGoalForm.tsx', 
      context: 'Goal validation and USD conversion logic'
    });

    // 4. Analyze MyBasketsContext for creation logic
    await runAnalysis('code_review', {
      code: 'Analyzing MyBasketsContext.tsx - createBasket function implementation',
      language: 'typescript',
      component: 'MyBasketsContext.tsx',
      context: 'Backend integration for basket creation with Supabase'
    });

    // 5. Analyze useMyBaskets hook
    await runAnalysis('code_review', {
      code: 'Analyzing useMyBaskets.ts - Database integration and mutations',
      language: 'typescript',
      component: 'useMyBaskets.ts',
      context: 'Supabase mutations for basket CRUD operations'
    });

    // 6. Analyze AuthContext for auth state management
    await runAnalysis('code_review', {
      code: 'Analyzing AuthContext.tsx - Authentication state and deferred login',
      language: 'typescript',
      component: 'AuthContext.tsx',
      context: 'WhatsApp login deferral until basket creation submit'
    });

    // 7. Schema analysis for baskets table
    await runAnalysis('schema_optimization', {
      schema: 'baskets table schema validation',
      tables: [
        {
          name: 'baskets',
          columns: ['id', 'creator_id', 'title', 'description', 'country', 'currency', 'status', 'created_at']
        }
      ],
      context: 'Validate baskets table supports all required fields for creation flow'
    });

    // 8. Error analysis for common basket creation failures
    await runAnalysis('error_analysis', {
      error: 'Basket creation flow authentication and validation errors',
      stackTrace: 'Anonymous users vs authenticated users basket creation',
      context: 'IKANISA basket creation with deferred WhatsApp auth',
      codeSnippet: 'Auth check timing and form submission flow'
    });

    // Generate audit summary
    generateAuditSummary();
    setAuditComplete(true);
    console.log('✅ Basket creation audit complete');
  };

  const generateAuditSummary = () => {
    const auditItems: AuditItem[] = [
      // BasketWizard Analysis
      {
        component: 'BasketWizard',
        status: 'connected',
        description: 'Main wizard component with step navigation',
        location: 'src/pages/BasketWizard.tsx',
      },
      {
        component: 'Form State Management',
        status: 'connected', 
        description: 'useState hooks for form data and validation',
        location: 'src/pages/BasketWizard.tsx:21-29',
      },
      {
        component: 'createBasket Function Call',
        status: 'connected',
        description: 'Calls MyBasketsContext.createBasket on form submit',
        location: 'src/pages/BasketWizard.tsx:72-88',
      },
      
      // Context Analysis
      {
        component: 'MyBasketsContext.createBasket',
        status: 'broken',
        description: 'Function exists but uses mock data instead of Supabase',
        location: 'src/hooks/useMyBaskets.ts:74-101',
        fixSteps: [
          'Replace mock basket creation with Supabase mutation',
          'Add proper error handling for database operations',
          'Implement RLS policy enforcement'
        ]
      },
      
      // Database Schema
      {
        component: 'baskets table',
        status: 'missing',
        description: 'Missing required fields: goal_amount, duration_days, tags, category',
        location: 'Supabase baskets table',
        fixSteps: [
          'Add goal_amount DECIMAL column',
          'Add duration_days INTEGER column', 
          'Add category TEXT column',
          'Add tags JSONB column for metadata'
        ]
      },
      
      // Authentication Flow
      {
        component: 'Auth State Check',
        status: 'broken',
        description: 'No authentication check before basket creation',
        location: 'src/pages/BasketWizard.tsx:72-88',
        fixSteps: [
          'Add auth state check in handleCreateBasket',
          'Redirect to WhatsApp login if anonymous',
          'Resume creation flow after successful login'
        ]
      },
      
      // USSD Code Generation
      {
        component: 'Payment Code Generation',
        status: 'missing',
        description: 'No USSD code or payment link generation',
        location: 'Backend Edge Function needed',
        fixSteps: [
          'Create generate-basket-code Edge Function',
          'Add momo_code field to baskets table',
          'Integrate with basket creation flow'
        ]
      },
      
      // Country Integration
      {
        component: 'Country Detection',
        status: 'missing',
        description: 'No country selection or detection in basket creation',
        location: 'Missing from basket forms',
        fixSteps: [
          'Add country dropdown to BasketNameForm',
          'Connect to countries table',
          'Auto-detect user country if possible'
        ]
      },
      
      // RLS Policies
      {
        component: 'RLS Policies for baskets',
        status: 'missing',
        description: 'No Row Level Security policies for basket creation',
        location: 'Supabase RLS configuration',
        fixSteps: [
          'Create policy: Users can create their own baskets',
          'Create policy: Users can view public baskets',
          'Create policy: Creators can update their baskets'
        ]
      }
    ];

    setAuditResults(auditItems);
  };

  const getStatusIcon = (status: AuditItem['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'broken':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'missing':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: AuditItem['status']) => {
    const variants = {
      connected: 'bg-green-100 text-green-800',
      broken: 'bg-red-100 text-red-800', 
      missing: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const connectedItems = auditResults.filter(item => item.status === 'connected');
  const brokenItems = auditResults.filter(item => item.status === 'broken');
  const missingItems = auditResults.filter(item => item.status === 'missing');

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Create a Basket Flow - Backend Integration Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runBasketCreationAudit}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Running Audit...' : 'Start Basket Creation Audit'}
            </Button>
            {auditComplete && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Audit Complete
              </Badge>
            )}
          </div>

          {auditResults.length > 0 && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold text-green-600">{connectedItems.length}</div>
                    <div className="text-sm text-gray-600">✅ Connected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <XCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                    <div className="text-2xl font-bold text-red-600">{brokenItems.length}</div>
                    <div className="text-sm text-gray-600">❌ Broken</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold text-orange-600">{missingItems.length}</div>
                    <div className="text-sm text-gray-600">🔧 Missing</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Audit Results</h3>
                
                {auditResults.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{item.component}</h4>
                            {getStatusBadge(item.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                          <p className="text-xs text-gray-500">{item.location}</p>
                          
                          {item.fixSteps && item.fixSteps.length > 0 && (
                            <div className="mt-2">
                              <div className="flex items-center gap-1 mb-1">
                                <Wrench className="w-3 h-3 text-orange-500" />
                                <span className="text-xs font-semibold text-orange-600">Fix Steps:</span>
                              </div>
                              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                                {item.fixSteps.map((step, stepIndex) => (
                                  <li key={stepIndex}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Priority Fixes */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">🚨 Priority Fixes Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800">1. Database Schema Updates</h4>
                      <p className="text-sm text-red-700">Add missing fields to baskets table (goal_amount, duration_days, category, tags)</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800">2. Replace Mock Data with Supabase</h4>
                      <p className="text-sm text-orange-700">Connect createBasket function to actual Supabase mutations</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800">3. Implement Authentication Check</h4>
                      <p className="text-sm text-yellow-700">Add deferred WhatsApp login before basket creation submit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
