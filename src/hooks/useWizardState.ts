
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyBasketsContext } from '@/contexts/MyBasketsContext';
import { toast } from 'sonner';
import { BasketData } from '@/types/wizard';

export const useWizardState = () => {
  const navigate = useNavigate();
  const { createBasket } = useMyBasketsContext();
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

  const handleComplete = async () => {
    // Create the actual basket with proper data structure
    try {
      console.log('Creating basket with data:', basketData);
      
      await createBasket({
        name: basketData.name,
        description: basketData.description,
        status: 'private',
        isPrivate: true,
        progress: 0,
        goal: parseInt(basketData.goal) || 10000,
        currentAmount: 0,
        participants: 1,
        daysLeft: parseInt(basketData.duration) * 30 // Convert months to approximate days
      });

      toast.success('🎉 Private basket created successfully!', {
        description: 'Your private savings group is ready to go!',
        duration: 4000,
      });
      navigate('/create/step/4');
    } catch (error) {
      console.error('Failed to create basket:', error);
      toast.error('Failed to create basket. Please try again.');
    }
  };

  const handleGoToMyBaskets = () => {
    // Navigate to My Baskets with created tab active
    navigate('/baskets/mine?tab=created');
  };

  return {
    basketData,
    showCoachMark,
    setShowCoachMark,
    updateBasketData,
    handleBack,
    handleNext,
    handleComplete,
    handleGoToMyBaskets
  };
};
