
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { CharacterCounter } from '@/components/wizard/CharacterCounter';

interface BasketNameFormProps {
  formData: {
    name: string;
    description: string;
  };
  errors: {
    name: boolean;
    description: boolean;
  };
  onInputChange: (field: string, value: string) => void;
}

export const BasketNameForm: React.FC<BasketNameFormProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="wizard-step space-y-4 sm:space-y-6 animate-fade-in">
      <GlassCard variant="strong" className="p-4 sm:p-6 space-y-4 sm:space-y-6 hover:scale-[1.01] transition-all duration-300 bg-white/20 dark:bg-black/20">
        <div className="space-y-2">
          <label className="block text-foreground font-semibold text-sm sm:text-base flex items-center gap-2">
            Basket Name
            <span className="text-red-400">*</span>
          </label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => onInputChange('name', e.target.value)} 
            placeholder="Enter basket name" 
            className={`w-full p-3 sm:p-4 rounded-xl glass-input bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 text-foreground placeholder-foreground/50 font-medium text-sm sm:text-base transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/40 dark:focus:bg-black/40 ${errors.name ? 'border-red-400 animate-shake' : ''}`}
            maxLength={50} 
          />
          <CharacterCounter current={formData.name.length} max={50} error={errors.name} />
        </div>

        <div className="space-y-2">
          <label className="block text-foreground font-semibold text-sm sm:text-base flex items-center gap-2">
            Description
            <span className="text-foreground/60 dark:text-foreground/50 text-xs font-medium">(optional)</span>
          </label>
          <textarea 
            value={formData.description} 
            onChange={e => onInputChange('description', e.target.value)} 
            placeholder="What's this basket for? (optional)" 
            className={`w-full p-3 sm:p-4 rounded-xl glass-input bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 text-foreground placeholder-foreground/50 font-medium min-h-20 sm:min-h-24 resize-none text-sm sm:text-base transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/40 dark:focus:bg-black/40 ${errors.description ? 'border-red-400 animate-shake' : ''}`}
            maxLength={200} 
            rows={3} 
          />
          <CharacterCounter current={formData.description.length} max={200} error={errors.description} />
        </div>
      </GlassCard>
    </div>
  );
};
