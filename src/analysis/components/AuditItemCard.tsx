
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react';

interface AuditItem {
  component: string;
  status: 'connected' | 'missing' | 'broken';
  description: string;
  location: string;
  fixSteps?: string[];
}

interface AuditItemCardProps {
  item: AuditItem;
}

export const AuditItemCard: React.FC<AuditItemCardProps> = ({ item }) => {
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

  return (
    <Card className="p-4">
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
  );
};
