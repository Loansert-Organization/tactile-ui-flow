
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PriorityFixes: React.FC = () => {
  return (
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
  );
};
