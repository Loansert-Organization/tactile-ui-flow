
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Users, Lock, Eye, Share2 } from 'lucide-react';
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
  privacy: 'public' | 'private';
  anonymity: 'anonymous' | 'named';
  inviteCode: string;
}

const CreateBasketWizard = () => {
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const [basketData, setBasketData] = useState<BasketData>({
    name: '',
    description: '',
    goal: '',
    frequency: 'monthly',
    duration: '12',
    privacy: 'private',
    anonymity: 'named',
    inviteCode: ''
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
    // Generate invite code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setBasketData(prev => ({ ...prev, inviteCode: code }));
    
    // Show confetti effect
    const confetti = () => {
      const colors = ['#ff006e', '#ff8500', '#06ffa5', '#0099ff', '#8b5cf6', '#ec4899'];
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          const confettiPiece = document.createElement('div');
          confettiPiece.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            z-index: 1000;
            animation: confetti-fall 3s ease-out forwards;
            border-radius: 50%;
          `;
          document.body.appendChild(confettiPiece);
          setTimeout(() => confettiPiece.remove(), 3000);
        }, i * 50);
      }
    };

    confetti();
    toast.success('Basket created successfully!');
    navigate('/create/step/4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
      `}</style>
      
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
      </Routes>
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

// Step 1: Basic Info
const Step1 = ({ basketData, updateBasketData, onBack, onNext, handlePress }: StepProps) => (
  <GlassCard className="max-w-md mx-auto p-6 mt-20">
    <div className="flex items-center justify-between mb-6">
      <button onClick={(e) => { handlePress(e); onBack(); }} className="p-2 rounded-lg hover:bg-white/10">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center">
        <h1 className="text-xl font-bold">Create Basket</h1>
        <div className="flex gap-2 mt-2">
          <div className="w-8 h-1 bg-gradient-magenta-orange rounded" />
          <div className="w-8 h-1 bg-white/20 rounded" />
          <div className="w-8 h-1 bg-white/20 rounded" />
          <div className="w-8 h-1 bg-white/20 rounded" />
        </div>
      </div>
      <div className="w-9" />
    </div>

    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-teal-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="w-8 h-8 text-teal-300" />
        </div>
        <h2 className="text-lg font-semibold gradient-text">Basic Information</h2>
        <p className="text-gray-400 text-sm">Tell us about your savings goal</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Basket Name</label>
        <Input
          value={basketData.name}
          onChange={(e) => updateBasketData?.('name', e.target.value)}
          placeholder="e.g., Holiday Savings Group"
          className="bg-white/10 border-white/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={basketData.description}
          onChange={(e) => updateBasketData?.('description', e.target.value)}
          placeholder="Describe your savings goal..."
          className="bg-white/10 border-white/20"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Target Goal (RWF)</label>
        <Input
          type="number"
          value={basketData.goal}
          onChange={(e) => updateBasketData?.('goal', e.target.value)}
          placeholder="0"
          className="bg-white/10 border-white/20"
        />
      </div>

      <Button 
        onClick={(e) => { handlePress(e); onNext?.(); }}
        className="w-full bg-gradient-magenta-orange"
        disabled={!basketData.name.trim() || !basketData.goal.trim()}
      >
        Next <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </GlassCard>
);

// Step 2: Privacy Settings
const Step2 = ({ basketData, updateBasketData, onBack, onNext, handlePress }: StepProps) => (
  <GlassCard className="max-w-md mx-auto p-6 mt-20">
    <div className="flex items-center justify-between mb-6">
      <button onClick={(e) => { handlePress(e); onBack(); }} className="p-2 rounded-lg hover:bg-white/10">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center">
        <h1 className="text-xl font-bold">Create Basket</h1>
        <div className="flex gap-2 mt-2">
          <div className="w-8 h-1 bg-gradient-magenta-orange rounded" />
          <div className="w-8 h-1 bg-gradient-magenta-orange rounded" />
          <div className="w-8 h-1 bg-white/20 rounded" />
          <div className="w-8 h-1 bg-white/20 rounded" />
        </div>
      </div>
      <div className="w-9" />
    </div>

    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-purple-pink/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-8 h-8 text-purple-300" />
        </div>
        <h2 className="text-lg font-semibold gradient-text">Privacy Settings</h2>
        <p className="text-gray-400 text-sm">Choose how your basket will be shared</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Basket Visibility</label>
        <div className="space-y-3">
          <button
            onClick={() => updateBasketData?.('privacy', 'private')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              basketData.privacy === 'private' 
                ? 'border-purple-500 bg-purple-500/20' 
                : 'border-white/20 bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Private</p>
                <p className="text-xs text-gray-400">Invite-only basket</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => updateBasketData?.('privacy', 'public')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              basketData.privacy === 'public' 
                ? 'border-purple-500 bg-purple-500/20' 
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
        <label className="block text-sm font-medium mb-3">Contribution Frequency</label>
        <select 
          value={basketData.frequency}
          onChange={(e) => updateBasketData?.('frequency', e.target.value)}
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
      >
        Next <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </GlassCard>
);

// Step 3: Anonymity Settings
const Step3 = ({ basketData, updateBasketData, onBack, onNext, handlePress }: StepProps) => (
  <GlassCard className="max-w-md mx-auto p-6 mt-20">
    <div className="flex items-center justify-between mb-6">
      <button onClick={(e) => { handlePress(e); onBack(); }} className="p-2 rounded-lg hover:bg-white/10">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center">
        <h1 className="text-xl font-bold">Create Basket</h1>
        <div className="flex gap-2 mt-2">
          <div className="w-8 h-1 bg-gradient-magenta-orange rounded" />
          <div className="w-8 h-1 bg-gradient-magenta-orange rounded" />
          <div className="w-8 h-1 bg-gradient-magenta-orange rounded" />
          <div className="w-8 h-1 bg-white/20 rounded" />
        </div>
      </div>
      <div className="w-9" />
    </div>

    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-magenta-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Eye className="w-8 h-8 text-orange-300" />
        </div>
        <h2 className="text-lg font-semibold gradient-text">Anonymity Settings</h2>
        <p className="text-gray-400 text-sm">Choose how contributions are displayed</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Contribution Display</label>
        <div className="space-y-3">
          <button
            onClick={() => updateBasketData?.('anonymity', 'named')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              basketData.anonymity === 'named' 
                ? 'border-orange-500 bg-orange-500/20' 
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
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              basketData.anonymity === 'anonymous' 
                ? 'border-orange-500 bg-orange-500/20' 
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

      <div>
        <label className="block text-sm font-medium mb-2">Duration (months)</label>
        <Input
          type="number"
          value={basketData.duration}
          onChange={(e) => updateBasketData?.('duration', e.target.value)}
          placeholder="12"
          className="bg-white/10 border-white/20"
        />
      </div>

      <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Summary</h3>
        <div className="space-y-1 text-sm text-gray-300">
          <p>Name: {basketData.name}</p>
          <p>Goal: RWF {basketData.goal}</p>
          <p>Frequency: {basketData.frequency}</p>
          <p>Duration: {basketData.duration} months</p>
          <p>Privacy: {basketData.privacy}</p>
          <p>Display: {basketData.anonymity}</p>
        </div>
      </div>

      <Button 
        onClick={(e) => { handlePress(e); onNext?.(); }}
        className="w-full bg-gradient-magenta-orange"
        disabled={!basketData.duration.trim()}
      >
        Create Basket <Check className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </GlassCard>
);

// Step 4: Share & Complete
const Step4 = ({ basketData, onBack, handlePress }: StepProps) => {
  const copyInviteCode = () => {
    navigator.clipboard.writeText(basketData.inviteCode);
    toast.success('Invite code copied to clipboard!');
  };

  const shareBasket = () => {
    if (navigator.share) {
      navigator.share({
        title: basketData.name,
        text: `Join my savings basket: ${basketData.name}`,
        url: `${window.location.origin}/invite/${basketData.inviteCode}`
      });
    } else {
      copyInviteCode();
    }
  };

  return (
    <GlassCard className="max-w-md mx-auto p-6 mt-20">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-magenta-orange/20 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-green-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Basket Created!</h1>
          <p className="text-gray-400">Your savings basket is ready. Invite others to join!</p>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Invitation Code</h3>
          <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
            <code className="flex-1 text-lg font-mono text-center text-orange-300">
              {basketData.inviteCode || 'ABC123'}
            </code>
            <button
              onClick={copyInviteCode}
              className="p-2 hover:bg-white/10 rounded"
            >
              📋
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={(e) => { handlePress(e); shareBasket(); }}
            className="w-full bg-gradient-teal-blue"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Basket
          </Button>

          <Button
            onClick={(e) => { handlePress(e); onBack(); }}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            View My Baskets
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default CreateBasketWizard;
