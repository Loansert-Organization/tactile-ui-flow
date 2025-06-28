import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const {
    t
  } = useTranslation();
  return <div className="wizard-step space-y-4 sm:space-y-6 animate-fade-in">
      

      <GlassCard variant="strong" className="p-4 sm:p-6 space-y-4 sm:space-y-6 hover:scale-[1.01] transition-all duration-300 bg-white/20 dark:bg-black/20">
        <div className="space-y-2">
          <label htmlFor="basket-name" className="block text-foreground font-semibold text-base sm:text-lg flex items-center gap-2">
            {t('wizard.basketNameLabel')}
            <span className="text-red-400 text-lg" aria-label="required">*</span>
          </label>
          <input id="basket-name" type="text" value={formData.name} onChange={e => onInputChange('name', e.target.value)} placeholder={t('wizard.namePlaceholder')} className={`w-full p-4 sm:p-5 rounded-xl glass-input bg-white/30 dark:bg-black/30 border-2 border-white/40 dark:border-white/20 text-foreground placeholder-foreground/50 font-medium text-base sm:text-lg transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/40 dark:focus:bg-black/40 touch-target ${errors.name ? 'border-red-400 animate-shake' : ''}`} maxLength={50} aria-describedby={errors.name ? "name-error" : "name-counter"} aria-invalid={errors.name} />
          <CharacterCounter current={formData.name.length} max={50} error={errors.name} />
          {errors.name && <p id="name-error" className="text-red-400 text-sm sm:text-base animate-fade-in font-medium" role="alert">
              {t('wizard.basketNameRequired')}
            </p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="basket-description" className="block text-foreground font-semibold text-base sm:text-lg flex items-center gap-2">
            {t('wizard.descriptionLabel')}
            <span className="text-foreground/60 dark:text-foreground/50 text-sm font-medium">
              ({t('common.optional')})
            </span>
          </label>
          <textarea id="basket-description" value={formData.description} onChange={e => onInputChange('description', e.target.value)} placeholder={t('wizard.descriptionPlaceholder')} className={`w-full p-4 sm:p-5 rounded-xl glass-input bg-white/30 dark:bg-black/30 border-2 border-white/40 dark:border-white/20 text-foreground placeholder-foreground/50 font-medium min-h-24 sm:min-h-28 resize-none text-base sm:text-lg transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/40 dark:focus:bg-black/40 ${errors.description ? 'border-red-400 animate-shake' : ''}`} maxLength={200} rows={3} aria-describedby="description-counter" aria-invalid={errors.description} />
          <CharacterCounter current={formData.description.length} max={200} error={errors.description} />
        </div>
      </GlassCard>
    </div>;
};