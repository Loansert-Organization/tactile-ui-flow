import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';
import { BasketHeader } from '@/components/basket/BasketHeader';
import { FinancialSummary } from '@/components/basket/FinancialSummary';
import { BasketActions } from '@/components/basket/BasketActions';
import { BasketStats } from '@/components/basket/BasketStats';
import { QRCodeModal } from '@/components/QRCodeModal';
import { Skeleton } from '@/components/ui/skeleton';

interface Basket {
  id: string;
  name: string;
  description: string;
  goal: number;
  total_contributions: number;
  bank_balance: number;
  participants_count: number;
  progress: number;
  days_left: number;
  is_owner: boolean;
  my_contribution: number;
  created_at: string;
  country: string;
  is_public: boolean;
}

export const BasketOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [basket, setBasket] = useState<Basket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [contributedAmount, setContributedAmount] = useState(0);

  // Fetch basket data
  useEffect(() => {
    const fetchBasketData = async () => {
      if (!id || !user?.id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch basket details
        const { data: basketData, error: basketError } = await supabase
          .from('baskets')
          .select(`
            *,
            contributions!inner(amount_usd),
            basket_members!inner(user_id)
          `)
          .eq('id', id)
          .single();

        if (basketError) {
          if (import.meta.env.DEV) console.error('Error fetching basket:', basketError);
          setError('Failed to load basket details');
          return;
        }

        // Calculate derived values
        const totalContributions = basketData.contributions?.reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0;
        const participantsCount = basketData.basket_members?.length || 0;
        const progress = basketData.goal_amount > 0 ? Math.round((totalContributions / basketData.goal_amount) * 100) : 0;
        
        // Calculate days left (assuming 30 days from creation)
        const createdDate = new Date(basketData.created_at);
        const daysLeft = Math.max(0, 30 - Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

        // Check if user is owner
        const isOwner = basketData.creator_id === user.id;

        // Fetch user's contribution
        const { data: userContribution } = await supabase
          .from('contributions')
          .select('amount_usd')
          .eq('basket_id', id)
          .eq('user_id', user.id);

        const myContribution = userContribution?.reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0;

        setBasket({
          ...basketData,
          name: basketData.title,
          goal: basketData.goal_amount,
          total_contributions: totalContributions,
          bank_balance: totalContributions, // Assuming bank balance equals total contributions
          participants_count: participantsCount,
          progress,
          days_left: daysLeft,
          is_owner: isOwner,
          my_contribution: myContribution
        });

      } catch (err) {
        if (import.meta.env.DEV) console.error('Basket fetch error:', err);
        setError('Failed to load basket details');
      } finally {
        setLoading(false);
      }
    };

    fetchBasketData();
  }, [id, user?.id]);

  const handleContributionSuccess = (amount: number) => {
    setContributedAmount(amount);
    setShowSuccessModal(true);
    // Refresh basket data
    window.location.reload();
  };

  const handleShare = () => {
    // Share functionality is now handled in BasketHeader
  };

  const handleSettings = () => {
    navigate(`/basket/${id}/settings`);
  };

  const handleContribute = () => {
    navigate(`/basket/${id}/contribute`);
  };

  const handleViewMembers = () => {
    navigate(`/basket/${id}/participants`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
        <div className="px-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !basket) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Basket not found'}</p>
          <button
            onClick={() => navigate('/baskets/mine')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Back to My Baskets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header with back button */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/baskets/mine')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4 flex-shrink-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold truncate">Basket Details</h1>
          </div>
          <button
            onClick={() => setShowQRModal(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Generate QR Code"
          >
            <QrCode className="w-6 h-6 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 mb-6">
        <BasketHeader
          basket={basket}
          onShare={handleShare}
          onSettings={handleSettings}
        />
      </div>

      {/* Financial Summary */}
      <div className="px-6 mb-6">
        <FinancialSummary
          totalContributions={basket.total_contributions}
          bankBalance={basket.bank_balance}
          myContribution={basket.my_contribution}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-6">
        <BasketActions
          basketId={id!}
          onContribute={handleContribute}
          onViewMembers={handleViewMembers}
        />
      </div>

      {/* Quick Stats */}
      <div className="px-6">
        <BasketStats
          totalContributions={basket.total_contributions}
          participants={basket.participants_count}
          goal={basket.goal}
        />
      </div>

      <ContributionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={contributedAmount}
        basketName={basket.name}
        basketId={id}
      />

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        basketId={id!}
        basketName={basket.name}
        basketURL={`${window.location.origin}/basket/${id}`}
      />
    </div>
  );
};
