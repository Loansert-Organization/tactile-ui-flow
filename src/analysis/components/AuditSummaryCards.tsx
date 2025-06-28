
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AuditItem {
  component: string;
  status: 'connected' | 'missing' | 'broken';
  description: string;
  location: string;
  fixSteps?: string[];
}

interface AuditSummaryCardsProps {
  auditResults: AuditItem[];
}

export const AuditSummaryCards: React.FC<AuditSummaryCardsProps> = ({ auditResults }) => {
  const connectedItems = auditResults.filter(item => item.status === 'connected');
  const brokenItems = auditResults.filter(item => item.status === 'broken');
  const missingItems = auditResults.filter(item => item.status === 'missing');

  return (
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
  );
};
