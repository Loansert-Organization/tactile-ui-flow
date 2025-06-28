
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Users, Gift, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreen {
  icon: React.ComponentType<any>;
  titleKey: string;
  descKey: string;
  gradient: string;
}

const welcomeScreens: WelcomeScreen[] = [
  {
    icon: Users,
    titleKey: 'welcome.title1',
    descKey: 'welcome.desc1',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    icon: Gift,
    titleKey: 'welcome.title2',
    descKey: 'welcome.desc2',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    icon: TrendingUp,
    titleKey: 'welcome.title3',
    descKey: 'welcome.desc3',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    icon: Sparkles,
    titleKey: 'welcome.title4',
    descKey: 'welcome.desc4',
    gradient: 'from-purple-500 to-pink-600'
  }
];

export const WelcomeExperience = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNext = () => {
    if (currentScreen < welcomeScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('ikanisaOnboarded', 'true');
    navigate('/');
  };

  const handleGetStarted = () => {
    localStorage.setItem('ikanisaOnboarded', 'true');
    navigate('/');
  };

  const isLastScreen = currentScreen === welcomeScreens.length - 1;
  const currentScreenData = welcomeScreens[currentScreen];
  const IconComponent = currentScreenData.icon;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        {!isLastScreen && (
          <button
            onClick={handleSkip}
            className="text-primary text-sm underline hover:text-primary/80 transition-colors"
          >
            {t('common.skip')}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-center max-w-md mx-auto"
          >
            {/* Icon with Gradient Background */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br ${currentScreenData.gradient} flex items-center justify-center shadow-2xl`}
            >
              <IconComponent className="w-16 h-16 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-foreground mb-6"
            >
              {t(currentScreenData.titleKey)}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed mb-12"
            >
              {t(currentScreenData.descKey)}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex space-x-2 mb-8">
          {welcomeScreens.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentScreen
                  ? 'bg-primary scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="w-full max-w-md space-y-4">
          {isLastScreen ? (
            <Button
              onClick={handleGetStarted}
              className="w-full bg-primary text-white rounded-xl py-3 text-lg font-semibold hover:bg-primary/90 transition-colors"
              size="lg"
            >
              {t('welcome.getStarted')}
            </Button>
          ) : (
            <div className="flex space-x-4">
              {currentScreen > 0 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1 rounded-xl py-3"
                  size="lg"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  {t('common.previous')}
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 bg-primary text-white rounded-xl py-3 hover:bg-primary/90 transition-colors"
                size="lg"
              >
                {t('common.next')}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeExperience;
