import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Users, Lock, Eye, Share2, X, Upload, Camera, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { usePressFeedback } from '@/hooks/useInteractions';
import { toast } from 'sonner';

interface BasketData {
  name: string;
  description: string;
  goal: string;
  frequency: string;
  duration: string;
  privacy: 'public' | 'private';
  anonymity: 'anonymous' | 'named';
  contributionType: 'recurring' | 'one-off';
  profileImage: string | null;
}

const CreateBasketWizard = () => {
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const [showCoachMark, setShowCoachMark] = useState(false);
  const [basketData, setBasketData] = useState<BasketData>({
    name: '',
    description: '',
    goal: '',
    frequency: 'monthly',
    duration: '12',
    privacy: 'private',
    anonymity: 'named',
    contributionType: 'recurring',
    profileImage: null
  });

  useEffect(() => {
    // Show coach mark on first visit
    const hasSeenCoachMark = localStorage.getItem('hasSeenWizardCoachMark');
    if (!hasSeenCoachMark) {
      setShowCoachMark(true);
      localStorage.setItem('hasSeenWizardCoachMark', 'true');
    }
  }, []);

  const updateBasketData = (field: keyof BasketData, value: string) => {
    setBasketData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = (nextStep: string) => {
    navigate(`/create/step/${nextStep}`);
  };

  const handleComplete = () => {
    if (basketData.privacy === 'public') {
      // Show pending review screen instead of confetti
      navigate('/create/step/4');
    } else {
      // Enhanced confetti effect for private baskets
      const triggerConfetti = () => {
        const colors = ['#ff006e', '#ff8500', '#06ffa5', '#0099ff', '#8b5cf6', '#ec4899'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1000;
        `;
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 80; i++) {
          setTimeout(() => {
            const confettiPiece = document.createElement('div');
            confettiPiece.style.cssText = `
              position: absolute;
              width: ${Math.random() * 8 + 6}px;
              height: ${Math.random() * 8 + 6}px;
              background: ${colors[Math.floor(Math.random() * colors.length)]};
              top: -20px;
              left: ${Math.random() * 100}vw;
              border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
              animation: enhanced-confetti-fall ${2 + Math.random() * 2}s ease-out forwards;
              transform: rotate(${Math.random() * 360}deg);
            `;
            confettiContainer.appendChild(confettiPiece);
            setTimeout(() => confettiPiece.remove(), 4000);
          }, i * 30);
        }

        setTimeout(() => confettiContainer.remove(), 5000);
      };

      triggerConfetti();
      toast.success('🎉 Basket created successfully!', {
        description: 'Your savings group is ready to go!',
        duration: 4000,
      });
      navigate('/create/step/5');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Coach Mark Overlay */}
      {showCoachMark && <CoachMarkOverlay onDismiss={() => setShowCoachMark(false)} />}

      <Routes>
        <Route path="/step/1" element={
          <Step1 
            basketData={basketData}
            updateBasketData={updateBasketData}
            onBack={handleBack}
            onNext={() => handleNext('2')}
            handlePress={handlePress}
          />
        } />
        <Route path="/step/2" element={
          <Step2 
            basketData={basketData}
            updateBasketData={updateBasketData}
            onBack={() => handleNext('1')}
            onNext={() => handleNext('3')}
            handlePress={handlePress}
          />
        } />
        <Route path="/step/3" element={
          <Step3 
            basketData={basketData}
            updateBasketData={updateBasketData}
            onBack={() => handleNext('2')}
            onNext={handleComplete}
            handlePress={handlePress}
          />
        } />
        <Route path="/step/4" element={
          <Step4 
            basketData={basketData}
            onBack={() => navigate('/baskets/mine')}
            handlePress={handlePress}
          />
        } />
        <Route path="/step/5" element={
          <Step5 
            basketData={basketData}
            onBack={() => navigate('/baskets/mine')}
            handlePress={handlePress}
          />
        } />
      </Routes>

      <style>{`
        @keyframes enhanced-confetti-fall {
          0% { 
            transform: translateY(-20px) rotate(0deg) scale(1); 
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) scale(1.2);
            opacity: 0.8;
          }
          100% { 
            transform: translateY(110vh) rotate(360deg) scale(0.5); 
            opacity: 0;
          }
        }

        @keyframes stepper-fill {
          0% { width: 0%; }
          100% { width: var(--target-width); }
        }

        @keyframes button-press {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        @keyframes input-glow {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
          50% { box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes slide-fade-in {
          0% { 
            opacity: 0; 
            transform: translateX(30px) scale(0.95); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
        }

        @keyframes slide-fade-out {
          0% { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translateX(-30px) scale(0.95); 
          }
        }

        .wizard-step {
          animation: slide-fade-in 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .neuro-button {
          background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          box-shadow: 
            8px 8px 16px rgba(0,0,0,0.3),
            -4px -4px 12px rgba(255,255,255,0.1),
            inset 1px 1px 2px rgba(255,255,255,0.2);
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .neuro-button:hover {
          box-shadow: 
            12px 12px 24px rgba(0,0,0,0.4),
            -6px -6px 16px rgba(255,255,255,0.15),
            inset 1px 1px 2px rgba(255,255,255,0.3);
        }

        .neuro-button:active {
          animation: button-press 0.1s ease-out;
          box-shadow: 
            4px 4px 8px rgba(0,0,0,0.4),
            -2px -2px 6px rgba(255,255,255,0.1),
            inset 2px 2px 4px rgba(0,0,0,0.2);
        }

        .glass-input {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .glass-input:focus {
          background: rgba(255,255,255,0.15);
          border-color: rgba(139, 92, 246, 0.5);
          animation: input-glow 0.6s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .wizard-step,
          .neuro-button,
          .glass-input {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

interface StepProps {
  basketData: BasketData;
  updateBasketData?: (field: keyof BasketData, value: string) => void;
  onBack: () => void;
  onNext?: () => void;
  handlePress: (e: React.MouseEvent) => void;
}

// Enhanced Stepper Component
const StepperBar = ({ currentStep }: { currentStep: number }) => (
  <div className="text-center mb-8">
    <h1 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
      Create Basket
    </h1>
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`h-2 rounded-full transition-all duration-500 ${
            step <= currentStep
              ? 'w-12 bg-gradient-to-r from-pink-500 to-orange-500'
              : 'w-8 bg-white/20'
          }`}
          style={{
            animation: step === currentStep ? 'stepper-fill 0.5s ease-out' : undefined,
            '--target-width': '100%'
          } as React.CSSProperties}
        />
      ))}
    </div>
  </div>
);

// Coach Mark Component
const CoachMarkOverlay = ({ onDismiss }: { onDismiss: () => void }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <GlassCard className="p-6 max-w-sm relative">
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto">
          <Share2 className="w-8 h-8 text-teal-300" />
        </div>
        <h3 className="text-lg font-semibold gradient-text">Welcome to the Basket Wizard!</h3>
        <p className="text-sm text-gray-300">
          Follow the steps to create your savings group. Swipe or tap to navigate between steps.
        </p>
        <Button onClick={onDismiss} className="w-full neuro-button">
          Got it!
        </Button>
      </div>
    </GlassCard>
  </div>
);

// Character Counter Component
const CharacterCounter = ({ current, max, error }: { current: number; max: number; error?: boolean }) => (
  <div className={`text-xs mt-1 ${error ? 'text-red-400' : 'text-gray-400'}`}>
    {current}/{max}
  </div>
);

// Step 1: Basic Info with Character Limits
const Step1 = ({ basketData, updateBasketData, onBack, onNext, handlePress }: StepProps) => {
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

  const handleInputChange = (field: keyof BasketData, value: string) => {
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
    <div className="wizard-step">
      <GlassCard className="max-w-md mx-auto p-6 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={(e) => { handlePress(e); onBack(); }} 
              className="p-2 rounded-lg hover:bg-white/10 neuro-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <StepperBar currentStep={1} />
            <div className="w-9" />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
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
                          <span className="text-2xl font-bold">{basketData.name.charAt(0)}</span>
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
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  Basket Name
                </label>
                <Input
                  value={basketData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Enter basket name..."
                  className={`glass-input text-white placeholder:text-gray-400 ${
                    errors.name ? 'border-red-500 animate-[shake_0.3s_ease-in-out]' : ''
                  }`}
                  maxLength={NAME_MAX + 10} // Allow typing over limit for better UX
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
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  Description
                </label>
                <Textarea
                  value={basketData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                  placeholder="Describe your savings goal..."
                  className={`glass-input text-white placeholder:text-gray-400 resize-none ${
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
                <label className="block text-sm font-medium mb-2 text-gray-200">
                  Target Goal (RWF)
                </label>
                <Input
                  type="text"
                  value={basketData.goal}
                  onChange={handleGoalChange}
                  placeholder="1,000"
                  className={`glass-input text-white placeholder:text-gray-400 ${
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
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 neuro-button text-white font-semibold py-3 text-base"
                disabled={!canProceed}
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// Step 2: Privacy Settings  
const Step2 = ({ basketData, updateBasketData, onBack, onNext, handlePress }: StepProps) => (
  <div className="wizard-step">
    <GlassCard className="max-w-md mx-auto p-6 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={(e) => { handlePress(e); onBack(); }} 
            className="p-2 rounded-lg hover:bg-white/10 neuro-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <StepperBar currentStep={2} />
          <div className="w-9" />
        </div>

        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3 neuro-button">
              <Lock className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Privacy Settings
            </h2>
            <p className="text-gray-400 text-sm mt-1">Choose how your basket will be shared</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-200">Basket Visibility</label>
            <div className="space-y-3">
              <button
                onClick={() => updateBasketData?.('privacy', 'private')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.privacy === 'private' 
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Private</p>
                    <p className="text-xs text-gray-400">Share via URL link only</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => updateBasketData?.('privacy', 'public')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.privacy === 'public' 
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Public</p>
                    <p className="text-xs text-gray-400">Anyone can discover and join</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-200">Contribution Type</label>
            <div className="space-y-3">
              <button
                onClick={() => updateBasketData?.('contributionType', 'recurring')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.contributionType === 'recurring' 
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium">Recurring Contributions</p>
                  <p className="text-xs text-gray-400">Regular scheduled contributions</p>
                </div>
              </button>

              <button
                onClick={() => updateBasketData?.('contributionType', 'one-off')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.contributionType === 'one-off' 
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium">One-Off Contributions</p>
                  <p className="text-xs text-gray-400">Flexible one-time contributions</p>
                </div>
              </button>
            </div>
          </div>

          {basketData.contributionType === 'recurring' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Contribution Frequency</label>
              <select 
                value={basketData.frequency}
                onChange={(e) => updateBasketData?.('frequency', e.target.value)}
                className="w-full p-3 rounded-lg glass-input text-white"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          )}

          <Button 
            onClick={(e) => { handlePress(e); onNext?.(); }}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 neuro-button text-white font-semibold py-3 text-base"
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </GlassCard>
  </div>
);

const Step3 = ({ basketData, updateBasketData, onBack, onNext, handlePress }: StepProps) => (
  <div className="wizard-step">
    <GlassCard className="max-w-md mx-auto p-6 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={(e) => { handlePress(e); onBack(); }} 
            className="p-2 rounded-lg hover:bg-white/10 neuro-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <StepperBar currentStep={3} />
          <div className="w-9" />
        </div>

        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3 neuro-button">
              <Eye className="w-8 h-8 text-orange-300" />
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              Anonymity Settings
            </h2>
            <p className="text-gray-400 text-sm mt-1">Choose how contributions are displayed</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-200">Contribution Display</label>
            <div className="space-y-3">
              <button
                onClick={() => updateBasketData?.('anonymity', 'named')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.anonymity === 'named' 
                    ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Show Names</p>
                    <p className="text-xs text-gray-400">Members can see who contributed</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => updateBasketData?.('anonymity', 'anonymous')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.anonymity === 'anonymous' 
                    ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Anonymous</p>
                    <p className="text-xs text-gray-400">Only amounts are visible</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {basketData.contributionType === 'recurring' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Duration (months)</label>
              <Input
                type="number"
                value={basketData.duration}
                onChange={(e) => updateBasketData?.('duration', e.target.value)}
                placeholder="12"
                className="glass-input text-white placeholder:text-gray-400"
              />
            </div>
          )}

          <Button 
            onClick={(e) => { handlePress(e); onNext?.(); }}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 neuro-button text-white font-semibold py-3 text-base"
            disabled={basketData.contributionType === 'recurring' && !basketData.duration.trim()}
          >
            Create Basket <Check className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </GlassCard>
  </div>
);

// Step 4: Pending Review (for public baskets)
const Step4 = ({ basketData, onBack, handlePress }: StepProps) => {
  return (
    <div className="wizard-step">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <GlassCard className="max-w-md mx-auto p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />
          
          <div className="relative text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto neuro-button">
              <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                Pending Review
              </h1>
              <p className="text-gray-400">Your public basket is under review. You'll be notified when it's approved.</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={(e) => { handlePress(e); onBack(); }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 neuro-button text-white font-semibold py-3 text-base"
              >
                View My Baskets
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// Step 5: Success (for private baskets)
const Step5 = ({ basketData, onBack, handlePress }: StepProps) => {
  const shareBasket = () => {
    const basketUrl = `${window.location.origin}/basket/1`;
    const message = `Hey! Join my Basket "${basketData.name}" and add your support via MOMO: ${basketUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    toast.success('📱 Opening WhatsApp…', {
      description: 'Redirecting to WhatsApp to share your basket',
      duration: 2000,
    });

    try {
      const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (!opened || opened.closed || typeof opened.closed == 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast.error("Couldn't open WhatsApp", {
        description: 'Please try again or share the link manually',
        duration: 4000,
      });
    }
  };

  return (
    <div className="wizard-step">
      <GlassCard className="max-w-md mx-auto p-6 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10" />
        
        <div className="relative">
          <StepperBar currentStep={4} />
          
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto neuro-button">
              <Check className="w-10 h-10 text-green-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Basket Created!
              </h1>
              <p className="text-gray-400">Your savings basket is ready. Share the link to invite others!</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={(e) => { handlePress(e); shareBasket(); }}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 neuro-button text-white font-semibold py-3 text-base"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Basket Link
              </Button>

              <Button
                onClick={(e) => { handlePress(e); onBack(); }}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 neuro-button"
              >
                View My Baskets
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default CreateBasketWizard;
