
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePressFeedback } from '@/hooks/useInteractions';
import { toast } from 'sonner';

interface BasketData {
  name: string;
  description: string;
  goal: string;
  frequency: string;
  duration: string;
}

const CreateBasketWizard = () => {
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const [basketData, setBasketData] = useState<BasketData>({
    name: '',
    description: '',
    goal: '',
    frequency: 'monthly',
    duration: '12'
  });

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
    // Here you would typically save the basket data
    console.log('Creating basket:', basketData);
    toast.success('Basket created successfully!');
    navigate('/baskets/mine');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
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
            onComplete={handleComplete}
            handlePress={handlePress}
          />
        } />
      </Routes>
    </div>
  );
};

interface StepProps {
  basketData: BasketData;
  updateBasketData: (field: keyof BasketData, value: string) => void;
  onBack: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  handlePress: (e: React.MouseEvent) => void;
}

const Step1 = ({ basketData, updateBasketData, onBack, onNext, handlePress }: StepProps) => (
  <GlassCard className="max-w-md mx-auto p-6">
    <div className="flex items-center justify-between mb-6">
      <button onClick={(e) => { handlePress(e); onBack(); }} className="p-2 rounded-lg hover:bg-white/10">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-bold">Create Basket (1/3)</h1>
      <div className="w-9" />
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Basket Name</label>
        <Input
          value={basketData.name}
          onChange={(e) => updateBasketData('name', e.target.value)}
          placeholder="Enter basket name..."
          className="bg-white/10 border-white/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={basketData.description}
          onChange={(e) => updateBasketData('description', e.target.value)}
          placeholder="Describe your basket..."
          className="bg-white/10 border-white/20"
          rows={3}
        />
      </div>

      <Button 
        onClick={(e) => { handlePress(e); onNext?.(); }}
        className="w-full bg-gradient-magenta-orange"
        disabled={!basketData.name.trim()}
      >
        Next <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </GlassCard>
);

const Step2 = ({ basketData, updateBasketData, onBack, onNext, handlePress }: StepProps) => (
  <GlassCard className="max-w-md mx-auto p-6">
    <div className="flex items-center justify-between mb-6">
      <button onClick={(e) => { handlePress(e); onBack(); }} className="p-2 rounded-lg hover:bg-white/10">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-bold">Create Basket (2/3)</h1>
      <div className="w-9" />
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Target Goal (RWF)</label>
        <Input
          type="number"
          value={basketData.goal}
          onChange={(e) => updateBasketData('goal', e.target.value)}
          placeholder="0"
          className="bg-white/10 border-white/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Contribution Frequency</label>
        <select 
          value={basketData.frequency}
          onChange={(e) => updateBasketData('frequency', e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>

      <Button 
        onClick={(e) => { handlePress(e); onNext?.(); }}
        className="w-full bg-gradient-magenta-orange"
        disabled={!basketData.goal.trim()}
      >
        Next <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </GlassCard>
);

const Step3 = ({ basketData, updateBasketData, onBack, onComplete, handlePress }: StepProps) => (
  <GlassCard className="max-w-md mx-auto p-6">
    <div className="flex items-center justify-between mb-6">
      <button onClick={(e) => { handlePress(e); onBack(); }} className="p-2 rounded-lg hover:bg-white/10">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-bold">Create Basket (3/3)</h1>
      <div className="w-9" />
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Duration (months)</label>
        <Input
          type="number"
          value={basketData.duration}
          onChange={(e) => updateBasketData('duration', e.target.value)}
          placeholder="12"
          className="bg-white/10 border-white/20"
        />
      </div>

      <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Summary</h3>
        <p className="text-sm text-gray-300">Name: {basketData.name}</p>
        <p className="text-sm text-gray-300">Goal: RWF {basketData.goal}</p>
        <p className="text-sm text-gray-300">Frequency: {basketData.frequency}</p>
        <p className="text-sm text-gray-300">Duration: {basketData.duration} months</p>
      </div>

      <Button 
        onClick={(e) => { handlePress(e); onComplete?.(); }}
        className="w-full bg-gradient-magenta-orange"
        disabled={!basketData.duration.trim()}
      >
        Create Basket <Check className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </GlassCard>
);

export default CreateBasketWizard;
