
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const LegalSupport: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          Terms & Conditions
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Privacy Policy
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Help & Support
        </Button>
      </CardContent>
    </Card>
  );
};
