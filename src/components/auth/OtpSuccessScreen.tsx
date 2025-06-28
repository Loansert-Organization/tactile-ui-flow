
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const OtpSuccessScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Welcome!</h2>
        <p className="text-green-600">Taking you to your dashboard...</p>
      </motion.div>
    </div>
  );
};
