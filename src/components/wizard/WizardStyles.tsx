
import React from 'react';

export const WizardStyles: React.FC = () => (
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
);
