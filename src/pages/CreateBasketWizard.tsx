import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';

const CreateBasketWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path.includes('step/1')) return 1;
    if (path.includes('step/2')) return 2;
    if (path.includes('step/3')) return 3;
    if (path.includes('step/4')) return 4;
    return 1;
  };
  const currentStep = getCurrentStep();
  const totalSteps = 4;
  return <div className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold gradient-text">Create Basket</h1>
          <p className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({
        length: totalSteps
      }, (_, index) => <div key={index} className={`h-2 flex-1 rounded-full transition-all ${index < currentStep ? 'bg-gradient-magenta-orange' : 'bg-gray-700'}`} />)}
      </div>

      {/* Step Content */}
      <Routes>
        <Route path="step/1" element={<Step1 />} />
        <Route path="step/2" element={<Step2 />} />
        <Route path="step/3" element={<Step3 />} />
        <Route path="step/4" element={<Step4 />} />
      </Routes>
    </div>;
};

const Step1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: ''
  });
  const isValid = formData.name && formData.description && formData.goal;
  const formatNumber = (value: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '');
    // Add commas for thousands
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatNumber(value);
    setFormData({
      ...formData,
      goal: formattedValue
    });
  };
  return <div className="flex-1 flex flex-col">
      <GlassCard className="p-6 flex-1">
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-gray-400 mb-6">Tell us about your basket</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Basket Name *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} placeholder="e.g., Lakers Championship Ring Fund" className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} placeholder="Describe what you're collecting for..." className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none" />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Goal Amount (RWF) *</label>
            <input type="text" value={formData.goal} onChange={handleGoalChange} placeholder="50,000" className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
        </div>
      </GlassCard>

      <GradientButton variant="primary" className="w-full mt-6" disabled={!isValid} onClick={() => navigate('/create/step/2')}>
        Next
        <ArrowRight className="w-5 h-5 ml-2" />
      </GradientButton>
    </div>;
};

const Step2 = () => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState('public');
  return <div className="flex-1 flex flex-col">
      <GlassCard className="p-6 flex-1">
        <h2 className="text-2xl font-bold mb-2">Privacy Settings</h2>
        <p className="text-gray-400 mb-6">Choose who can find and join your basket</p>

        <div className="space-y-4">
          <button onClick={() => setPrivacy('public')} className={`w-full p-4 rounded-lg border-2 transition-all text-left ${privacy === 'public' ? 'border-pink-500 bg-pink-500/10' : 'border-white/20 hover:border-white/40'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Public Basket</h3>
                <p className="text-sm text-gray-400">Anyone can discover and join</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${privacy === 'public' ? 'border-pink-500 bg-pink-500' : 'border-gray-400'}`}>
                {privacy === 'public' && <Check className="w-3 h-3 text-white m-0.5" />}
              </div>
            </div>
          </button>

          <button onClick={() => setPrivacy('private')} className={`w-full p-4 rounded-lg border-2 transition-all text-left ${privacy === 'private' ? 'border-pink-500 bg-pink-500/10' : 'border-white/20 hover:border-white/40'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Private Basket</h3>
                <p className="text-sm text-gray-400">Only invited people can join</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${privacy === 'private' ? 'border-pink-500 bg-pink-500' : 'border-gray-400'}`}>
                {privacy === 'private' && <Check className="w-3 h-3 text-white m-0.5" />}
              </div>
            </div>
          </button>
        </div>
      </GlassCard>

      <GradientButton variant="primary" className="w-full mt-6" onClick={() => navigate('/create/step/3')}>
        Next
        <ArrowRight className="w-5 h-5 ml-2" />
      </GradientButton>
    </div>;
};

const Step3 = () => {
  const navigate = useNavigate();
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  return <div className="flex-1 flex flex-col">
      <GlassCard className="p-4">
        <h2 className="text-2xl font-bold mb-2">Anonymity Settings</h2>
        <p className="text-gray-400 mb-4">Set default contribution visibility</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <h3 className="font-semibold">Allow Anonymous Contributions</h3>
              <p className="text-sm text-gray-400">Members can choose to hide their contribution amounts</p>
            </div>
            <button onClick={() => setAllowAnonymous(!allowAnonymous)} className={`relative w-12 h-6 rounded-full transition-all ${allowAnonymous ? 'bg-gradient-magenta-orange' : 'bg-gray-600'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform flex items-center justify-center ${allowAnonymous ? 'translate-x-7' : 'translate-x-1'}`}>
                {allowAnonymous && <Check className="w-3 h-3 text-gray-800" />}
              </div>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h4 className="font-medium text-blue-400 mb-2">Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>ABC123 contributed</span>
                <span className="text-green-400">RWF 5,000</span>
              </div>
              {allowAnonymous && <div className="flex justify-between">
                  <span>XYZ789 contributed</span>
                  <span className="text-gray-400">Hidden amount</span>
                </div>}
            </div>
          </div>
        </div>
      </GlassCard>

      <GradientButton variant="primary" className="w-full mt-6" onClick={() => navigate('/create/step/4')}>
        Next
        <ArrowRight className="w-5 h-5 ml-2" />
      </GradientButton>
    </div>;
};

const Step4 = () => {
  const navigate = useNavigate();
  const handleFinish = () => {
    // Simulate basket creation
    setTimeout(() => {
      navigate('/basket/new-basket-id');
    }, 1000);
  };
  return <div className="flex-1 flex flex-col">
      <GlassCard className="p-4">
        <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
        <p className="text-gray-400 mb-4">Your basket is ready to share</p>

        {/* Basket Preview */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-purple-pink flex items-center justify-center">
              <span className="text-lg font-bold text-white">L</span>
            </div>
            <div>
              <h3 className="font-semibold">Lakers Championship Ring Fund</h3>
              <p className="text-sm text-gray-400">Goal: RWF 50,000</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">Supporting our team to get that championship ring!</p>
        </div>

        <div className="space-y-3">
          <GradientButton variant="secondary" className="w-full">
            Share via WhatsApp
          </GradientButton>
          
          <GradientButton variant="accent" className="w-full">
            Copy Basket Link
          </GradientButton>
        </div>
      </GlassCard>

      <GradientButton variant="primary" className="w-full mt-6" onClick={handleFinish}>
        <Check className="w-5 h-5 mr-2" />
        Finish & View Basket
      </GradientButton>
    </div>;
};

export default CreateBasketWizard;
