
import React, { useEffect } from 'react';

interface ConfettiAnimationProps {
  trigger: boolean;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ trigger }) => {
  useEffect(() => {
    if (!trigger) return;

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
  }, [trigger]);

  return null;
};
