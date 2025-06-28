import React, { useState } from 'react';
import { ArrowLeft, Target, Clock, Shield, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { StepperBar } from '@/components/wizard/StepperBar';
import { CharacterCounter } from '@/components/wizard/CharacterCounter';
import { WizardStyles } from '@/components/wizard/WizardStyles';
import { usePressFeedback } from '@/hooks/useInteractions';
import { useMyBasketsContext } from '@/contexts/MyBasketsContext';
import { toast } from 'sonner';
const BasketWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const {
    handlePress
  } = usePressFeedback();
  const {
    createBasket
  } = useMyBasketsContext();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    duration: '30'
  });
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    goal: false
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };
  const validateStep1 = () => {
    const newErrors = {
      name: !formData.name.trim() || formData.name.length > 50,
      description: !formData.description.trim() || formData.description.length > 200,
      goal: false
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  const validateStep2 = () => {
    const goalNum = parseInt(formData.goal);
    const goalError = !formData.goal || goalNum <= 0 || goalNum > 10000000;
    setErrors(prev => ({
      ...prev,
      goal: goalError
    }));
    return !goalError;
  };
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleCreateBasket();
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/baskets/mine');
    }
  };
  const handleCreateBasket = async () => {
    setIsCreating(true);
    try {
      await createBasket({
        name: formData.name,
        description: formData.description,
        goal: parseInt(formData.goal),
        currentAmount: 0,
        progress: 0,
        participants: 1,
        daysLeft: parseInt(formData.duration),
        status: 'private',
        isPrivate: true
      });
      toast.success('Private basket created successfully!');
      navigate('/baskets/mine');
    } catch (error) {
      toast.error('Failed to create basket');
    } finally {
      setIsCreating(false);
    }
  };
  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name.trim() && formData.description.trim() && formData.name.length <= 50 && formData.description.length <= 200;
    }
    return formData.goal && parseInt(formData.goal) > 0 && parseInt(formData.goal) <= 10000000;
  };
  return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <WizardStyles />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={e => {
          handlePress(e);
          handleBack();
        }} className="p-3 rounded-full hover:bg-white/10 transition-all neuro-button focus-gradient" style={{
          minWidth: '44px',
          minHeight: '44px'
        }} aria-label="Go back">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        <StepperBar currentStep={currentStep} totalSteps={2} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="max-w-md mx-auto">
          {currentStep === 1 && <div className="wizard-step space-y-6">
              

              <GlassCard className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-white font-medium">Basket Name *</label>
                  <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Enter basket name" className={`w-full p-4 rounded-lg glass-input text-white placeholder-gray-400 ${errors.name ? 'border-red-400 animate-[shake_0.5s_ease-in-out]' : ''}`} maxLength={50} />
                  <CharacterCounter current={formData.name.length} max={50} error={errors.name} />
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-medium">Description *</label>
                  <textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="What's this basket for?" className={`w-full p-4 rounded-lg glass-input text-white placeholder-gray-400 min-h-24 resize-none ${errors.description ? 'border-red-400 animate-[shake_0.5s_ease-in-out]' : ''}`} maxLength={200} rows={3} />
                  <CharacterCounter current={formData.description.length} max={200} error={errors.description} />
                </div>
              </GlassCard>
            </div>}

          {currentStep === 2 && <div className="wizard-step space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Set Your Goal</h2>
                <p className="text-gray-300">How much do you want to raise?</p>
              </div>

              <GlassCard className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-white font-medium flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Goal Amount (RWF) *
                  </label>
                  <input type="number" value={formData.goal} onChange={e => handleInputChange('goal', e.target.value)} placeholder="10000" className={`w-full p-4 rounded-lg glass-input text-white placeholder-gray-400 text-center text-xl font-semibold ${errors.goal ? 'border-red-400 animate-[shake_0.5s_ease-in-out]' : ''}`} min={1} max={10000000} />
                  {errors.goal && <p className="text-red-400 text-sm">Please enter a valid amount (1 - 10,000,000 RWF)</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-medium flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Duration
                  </label>
                  <select value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} className="w-full p-4 rounded-lg glass-input text-white">
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Private Basket</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Only people you invite can see and contribute to this basket
                  </p>
                </div>
              </GlassCard>
            </div>}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <GradientButton variant="primary" className="w-full h-14 text-lg font-semibold neuro-button" onClick={handleNext} disabled={!canProceed() || isCreating}>
            {isCreating ? <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </div> : currentStep === 1 ? <>
                Next Step
                <ArrowRight className="w-5 h-5 ml-2" />
              </> : <>
                <Plus className="w-5 h-5 mr-2" />
                Create Basket
              </>}
          </GradientButton>
        </div>
      </div>
    </div>;
};
export default BasketWizard;