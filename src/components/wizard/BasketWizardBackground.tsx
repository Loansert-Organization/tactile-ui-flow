
import React from 'react';

export const BasketWizardBackground: React.FC = () => {
  return (
    <>
      {/* Animated Background Effects - Theme Adaptive */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 light:from-purple-100 light:via-blue-100 light:to-indigo-100" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 dark:from-purple-400/10 light:from-purple-600/30 via-transparent to-transparent animate-gradient" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-500/10 dark:bg-purple-400/5 light:bg-purple-600/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-500/10 dark:bg-blue-400/5 light:bg-blue-600/15 rounded-full blur-3xl animate-float-delayed" />
    </>
  );
};
