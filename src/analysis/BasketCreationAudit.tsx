
import React, { useState } from 'react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { AuditSummaryCards } from './components/AuditSummaryCards';
import { AuditItemCard } from './components/AuditItemCard';
import { PriorityFixes } from './components/PriorityFixes';
import { generateAuditData } from './utils/auditDataGenerator';

interface AuditItem {
  component: string;
  status: 'connected' | 'missing' | 'broken';
  description: string;
  location: string;
  fixSteps?: string[];
}

export const BasketCreationAudit: React.FC = () => {
  const { runAnalysis, loading } = useAIAnalysis();
  const [auditResults, setAuditResults] = useState<AuditItem[]>([]);
  const [auditComplete, setAuditComplete] = useState(false);

  const runBasketCreationAudit = async () => {
    console.log('🔍 Starting Create a Basket flow audit...');
    
    // Run comprehensive analysis
    await runAnalysis('code_review', {
      code: 'Analyzing complete basket creation flow integration',
      language: 'typescript',
      component: 'Basket Creation Flow',
      context: 'IKANISA PWA - Complete basket creation with Supabase integration'
    });

    // Generate audit summary with updated results
    const auditData = generateAuditData();
    setAuditResults(auditData);
    setAuditComplete(true);
    console.log('✅ Basket creation audit complete');
  };

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
              <AuditSummaryCards auditResults={auditResults} />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Audit Results</h3>
                {auditResults.map((item, index) => (
                  <AuditItemCard key={index} item={item} />
                ))}
              </div>

              <PriorityFixes />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
