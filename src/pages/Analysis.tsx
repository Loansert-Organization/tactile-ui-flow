
import React from 'react';
import { CodebaseAnalysis } from '@/analysis/CodebaseAnalysis';

const Analysis = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto">
        <CodebaseAnalysis />
      </div>
    </div>
  );
};

export default Analysis;
