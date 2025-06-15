
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { StepperBar } from './StepperBar';
import { CharacterCounter } from './CharacterCounter';
import { StepProps } from '@/types/wizard';

export const Step1: React.FC<StepProps> = ({ basketData, updateBasketData, onBack, onNext, handlePress }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const NAME_MAX = 50;
  const DESCRIPTION_MAX = 200;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!basketData.name.trim()) {
      newErrors.name = 'Basket name is required';
    } else if (basketData.name.length > NAME_MAX) {
      newErrors.name = `Max ${NAME_MAX} characters`;
    }
    
    if (basketData.description.length > DESCRIPTION_MAX) {
      newErrors.description = `Max ${DESCRIPTION_MAX} characters`;
    }
    
    if (!basketData.goal.trim()) {
      newErrors.goal = 'Goal amount is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };
    
    if (field === 'name') {
      if (!basketData.name.trim()) {
        newErrors.name = 'Basket name is required';
      } else if (basketData.name.length > NAME_MAX) {
        newErrors.name = `Max ${NAME_MAX} characters`;
      } else {
        delete newErrors.name;
      }
    }
    
    if (field === 'description') {
      if (basketData.description.length > DESCRIPTION_MAX) {
        newErrors.description = `Max ${DESCRIPTION_MAX} characters`;
      } else {
        delete newErrors.description;
      }
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof typeof basketData, value: string) => {
    updateBasketData?.(field, value);
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const handleNext = () => {
    if (validate()) {
      onNext?.();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateBasketData?.('profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatNumber(value);
    updateBasketData?.('goal', formattedValue);
  };

  const isNameError = basketData.name.length > NAME_MAX;
  const isDescError = basketData.description.length > DESCRIPTION_MAX;
  const canProceed = basketData.name.trim() && basketData.goal.trim() && !isNameError && !isDescError;

  return (
    <div className="wizard-step min-h-screen flex items-center justify-center px-2 py-10 sm:p-6">
      {/* Removed the gradient background layer for a minimalist look */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" /> */}
      
      <GlassCard className="w-full max-w-md p-6 relative overflow-hidden shadow-xl rounded-[2rem] border backdrop-blur-md" variant="strong">
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button 
              onClick={(e) => { handlePress(e); onBack(); }} 
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5 font-bold" />
            </button>
            <StepperBar currentStep={1} />
            <div className="w-9" />
          </div>

          <div className="space-y-6">
            <div className="space-y-5 sm:space-y-6">
              {/* Profile Image Upload */}
              <div className="text-center">
                <div className="flex justify-center">
                  <label className="relative cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={basketData.profileImage || undefined} alt="Basket profile" />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                        {basketData.name ? (
                          <span className="text-2xl font-extrabold">{basketData.name.charAt(0)}</span>
                        ) : (
                          <Camera className="w-8 h-8" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/20 group-hover:scale-110 transition-transform">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-lg mb-1 sm:mb-2 text-gray-200">
                  Basket Name
                </label>
                <Input
                  value={basketData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Enter basket name..."
                  className={`glass-input text-white placeholder:text-gray-400 text-base font-semibold py-2 px-3 ${
                    errors.name ? 'border-red-500 animate-[shake_0.3s_ease-in-out]' : ''
                  }`}
                  maxLength={NAME_MAX + 10}
                />
                <CharacterCounter 
                  current={basketData.name.length} 
                  max={NAME_MAX} 
                  error={isNameError}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-lg mb-1 sm:mb-2 text-gray-200">
                  Description
                </label>
                <Textarea
                  value={basketData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                  placeholder="Describe your savings goal..."
                  className={`glass-input text-white placeholder:text-gray-400 text-base font-normal resize-none py-2 px-3 ${
                    errors.description ? 'border-red-500 animate-[shake_0.3s_ease-in-out]' : ''
                  }`}
                  rows={3}
                  maxLength={DESCRIPTION_MAX + 20}
                />
                <CharacterCounter 
                  current={basketData.description.length} 
                  max={DESCRIPTION_MAX} 
                  error={isDescError}
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-lg mb-1 sm:mb-2 text-gray-200">
                  Target Goal (RWF)
                </label>
                <Input
                  type="text"
                  value={basketData.goal}
                  onChange={handleGoalChange}
                  placeholder="1,000"
                  className={`glass-input text-white placeholder:text-gray-400 text-base font-semibold py-2 px-3 ${
                    errors.goal ? 'border-red-500 animate-[shake_0.3s_ease-in-out]' : ''
                  }`}
                />
                {errors.goal && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.goal}
                  </p>
                )}
              </div>

              <Button 
                onClick={(e) => { handlePress(e); handleNext(); }}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 neuro-button text-white font-extrabold py-3 text-lg sm:text-xl tracking-wide"
                disabled={!canProceed}
              >
                Next <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
