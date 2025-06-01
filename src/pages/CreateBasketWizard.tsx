
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { usePressFeedback } from '@/hooks/useInteractions';
import { toast } from 'sonner';
import { CoachMarkOverlay } from '@/components/wizard/CoachMarkOverlay';
import { Step1 } from '@/components/wizard/Step1';
import { Step2 } from '@/components/wizard/Step2';
import { Step4 } from '@/components/wizard/Step4';
import { BasketData } from '@/types/wizard';

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
    privacy: 'private', // Always private for users
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
    // All user-created baskets are private, so go straight to success
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
    toast.success('🎉 Private basket created successfully!', {
      description: 'Your private savings group is ready to go!',
      duration: 4000,
    });
    navigate('/create/step/4');
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

export default CreateBasketWizard;
