
import React from 'react';

export const BasketWizardBackground: React.FC = () => {
  return (
    <>
      {/* Standard app background - consistent with home screen */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed" />
    </>
  );
};
