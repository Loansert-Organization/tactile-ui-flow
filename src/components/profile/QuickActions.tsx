
import React from 'react';
import { History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent className="space-y-4">
        <Button variant="ghost" className="w-full justify-between h-12" onClick={() => navigate('/history')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Transaction History</p>
              <p className="text-sm text-muted-foreground">View all your transactions</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Button>
      </CardContent>
    </Card>
  );
};
