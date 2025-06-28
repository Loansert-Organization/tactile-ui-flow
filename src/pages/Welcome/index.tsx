
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientButton } from '@/components/ui/gradient-button';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WelcomeExperience = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to BasketApp",
      description: "Save money together with friends and family through collaborative savings baskets.",
      image: "🏆",
    },
    {
      title: "Create Savings Goals",
      description: "Set up savings baskets for any goal - vacations, emergencies, or group purchases.",
      image: "🎯",
    },
    {
      title: "Invite Friends",
      description: "Share your basket with friends and family to reach your goals faster together.",
      image: "👥",
    },
    {
      title: "Track Progress",
      description: "Monitor your savings progress and celebrate milestones with your group.",
      image: "📈",
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login-options');
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleGetStarted = () => {
    navigate('/login-options');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Skip
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-8">
          {/* Slide Content */}
          <div className="space-y-6">
            <div className="text-8xl mb-6">
              {slides[currentSlide].image}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-purple-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 space-y-4">
        {currentSlide === slides.length - 1 ? (
          <GradientButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleGetStarted}
          >
            Get Started
          </GradientButton>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>
            <GradientButton
              variant="primary"
              size="lg"
              onClick={handleNext}
              className="flex-1"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </GradientButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeExperience;
