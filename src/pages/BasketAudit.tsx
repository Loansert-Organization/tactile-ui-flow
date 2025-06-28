
import React from 'react';
import { BasketCreationAudit } from '@/analysis/BasketCreationAudit';

const BasketAudit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto">
        <BasketCreationAudit />
      </div>
    </div>
  );
};

export default BasketAudit;
