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
  return <div className="wizard-step space-y-4 sm:space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        
        
      </div>

      <GlassCard variant="strong" className="p-4 sm:p-6 space-y-4 sm:space-y-6 hover:scale-[1.01] transition-all duration-300 bg-white/20 dark:bg-black/20">
        <div className="space-y-2">
          <label className="block text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            Goal Amount (RWF)
            <span className="text-red-400">*</span>
          </label>
          <input type="number" value={formData.goal} onChange={e => onInputChange('goal', e.target.value)} placeholder="10000" className={`w-full p-3 sm:p-4 rounded-xl glass-input bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 text-foreground placeholder-foreground/50 text-center text-lg sm:text-xl font-semibold transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/40 dark:focus:bg-black/40 ${errors.goal ? 'border-red-400 animate-shake' : ''}`} min={1} max={10000000} />
          {errors.goal && <p className="text-red-400 text-xs sm:text-sm animate-fade-in font-medium">Please enter a valid amount (1 - 10,000,000 RWF)</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            Duration
          </label>
          <select value={formData.duration} onChange={e => onInputChange('duration', e.target.value)} className="w-full p-3 sm:p-4 rounded-xl glass-input bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 text-foreground font-medium text-sm sm:text-base transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/40 dark:focus:bg-black/40">
            <option value="7" className="bg-background text-foreground">7 days</option>
            <option value="14" className="bg-background text-foreground">14 days</option>
            <option value="30" className="bg-background text-foreground">30 days</option>
            <option value="60" className="bg-background text-foreground">60 days</option>
            <option value="90" className="bg-background text-foreground">90 days</option>
          </select>
        </div>

        <GlassCard variant="subtle" className="p-3 sm:p-4 hover:variant-default transition-all duration-300 bg-white/15 dark:bg-black/15">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
            <span className="text-foreground font-semibold text-sm sm:text-base">Private Basket</span>
          </div>
          <p className="text-foreground/70 dark:text-foreground/60 text-xs sm:text-sm font-medium">
            Only people you invite can see and contribute to this basket
          </p>
        </GlassCard>
      </GlassCard>
    </div>;
};