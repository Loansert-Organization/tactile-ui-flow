import React from 'react';
import { Target, Clock, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const {
    t
  } = useTranslation();
  return <div className="wizard-step space-y-4 sm:space-y-6 animate-fade-in">
      

      <GlassCard variant="strong" className="p-4 sm:p-6 space-y-4 sm:space-y-6 hover:scale-[1.01] transition-all duration-300 bg-white/20 dark:bg-black/20">
        <div className="space-y-2">
          <label htmlFor="goal-amount" className="block text-foreground font-semibold flex items-center gap-2 text-base sm:text-lg">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            {t('wizard.goalAmountLabel')}
            <span className="text-red-400 text-lg" aria-label="required">*</span>
          </label>
          <input id="goal-amount" type="number" value={formData.goal} onChange={e => onInputChange('goal', e.target.value)} placeholder="10000" className={`w-full p-4 sm:p-5 rounded-xl glass-input bg-white/30 dark:bg-black/30 border-2 border-white/40 dark:border-white/20 text-foreground placeholder-foreground/50 text-center text-xl sm:text-2xl font-semibold transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/40 dark:focus:bg-black/40 touch-target ${errors.goal ? 'border-red-400 animate-shake' : ''}`} min={1} max={10000000} aria-describedby={errors.goal ? "goal-error" : undefined} aria-invalid={errors.goal} />
          {errors.goal && <p id="goal-error" className="text-red-400 text-sm sm:text-base animate-fade-in font-medium" role="alert">
              {t('wizard.goalAmountRequired')}
            </p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="duration" className="block text-foreground font-semibold flex items-center gap-2 text-base sm:text-lg">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            {t('wizard.durationLabel')}
          </label>
          <select id="duration" value={formData.duration} onChange={e => onInputChange('duration', e.target.value)} className="w-full p-4 sm:p-5 rounded-xl glass-input bg-white/30 dark:bg-black/30 border-2 border-white/40 dark:border-white/20 text-foreground font-medium text-base sm:text-lg transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/40 dark:focus:bg-black/40 touch-target">
            <option value="7" className="bg-background text-foreground">7 {t('wizard.days')}</option>
            <option value="14" className="bg-background text-foreground">14 {t('wizard.days')}</option>
            <option value="30" className="bg-background text-foreground">30 {t('wizard.days')}</option>
            <option value="60" className="bg-background text-foreground">60 {t('wizard.days')}</option>
            <option value="90" className="bg-background text-foreground">90 {t('wizard.days')}</option>
          </select>
        </div>

        <GlassCard variant="subtle" className="p-4 sm:p-5 hover:variant-default transition-all duration-300 bg-white/15 dark:bg-black/15">
          <div className="flex items-center gap-3 mb-2" role="img" aria-label="Private basket information">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
            <span className="text-foreground font-semibold text-base sm:text-lg">
              {t('wizard.privateBasket')}
            </span>
          </div>
          <p className="text-foreground/70 dark:text-foreground/60 text-sm sm:text-base font-medium">
            {t('wizard.privateBasketNote')}
          </p>
        </GlassCard>
      </GlassCard>
    </div>;
};