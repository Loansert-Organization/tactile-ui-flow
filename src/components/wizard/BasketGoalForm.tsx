
import React from 'react';
import { Target, Clock, Shield } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface BasketGoalFormProps {
  formData: {
    goal: string;
    duration: string;
  };
  errors: {
    goal: boolean;
  };
  onInputChange: (field: string, value: string) => void;
}

export const BasketGoalForm: React.FC<BasketGoalFormProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="wizard-step space-y-4 sm:space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
          Set Your Goal
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">How much do you want to raise?</p>
      </div>

      <GlassCard variant="strong" className="p-4 sm:p-6 space-y-4 sm:space-y-6 hover:scale-[1.01] transition-all duration-300">
        <div className="space-y-2">
          <label className="block text-white font-medium flex items-center gap-2 text-sm sm:text-base">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            Goal Amount (RWF)
            <span className="text-red-400">*</span>
          </label>
          <input 
            type="number" 
            value={formData.goal} 
            onChange={e => onInputChange('goal', e.target.value)} 
            placeholder="10000" 
            className={`w-full p-3 sm:p-4 rounded-xl glass-input text-white placeholder-gray-400 text-center text-lg sm:text-xl font-semibold transition-all duration-300 focus:scale-[1.01] ${errors.goal ? 'border-red-400 animate-shake' : 'focus:border-purple-400'}`}
            min={1} 
            max={10000000} 
          />
          {errors.goal && <p className="text-red-400 text-xs sm:text-sm animate-fade-in">Please enter a valid amount (1 - 10,000,000 RWF)</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-white font-medium flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            Duration
          </label>
          <select 
            value={formData.duration} 
            onChange={e => onInputChange('duration', e.target.value)} 
            className="w-full p-3 sm:p-4 rounded-xl glass-input text-white text-sm sm:text-base transition-all duration-300 focus:scale-[1.01] focus:border-purple-400"
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </select>
        </div>

        <GlassCard variant="subtle" className="p-3 sm:p-4 hover:variant-default transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
            <span className="text-white font-medium text-sm sm:text-base">Private Basket</span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">
            Only people you invite can see and contribute to this basket
          </p>
        </GlassCard>
      </GlassCard>
    </div>
  );
};
