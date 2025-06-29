import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Phone, AlertCircle, RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';

export const ContributionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contributedAmount, setContributedAmount] = useState(0);

  // Fetch basket data
  const { data: basketData, isLoading, error, refetch } = useQuery({
    queryKey: ['basket', id, 'contribute'],
    queryFn: async () => {
      if (!id) throw new Error('No basket ID provided');

      const { data, error } = await supabase
        .from('baskets')
        .select(`
          id,
          title,
          description,
          goal_amount,
          current_amount,
          currency,
          country,
          creator_id,
          is_private,
          users!baskets_creator_id_fkey(
            display_name,
            avatar_url,
            mobile_money_number,
            phone_number
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Basket not found');

      // Check if current user can contribute
      if (data.creator_id === user?.id) {
        throw new Error('You cannot contribute to your own basket');
      }

      // For private baskets, check if user is a member
      if (data.is_private) {
        const { data: membership, error: memberError } = await supabase
          .from('basket_members')
          .select('id')
          .eq('basket_id', id)
          .eq('user_id', user?.id)
          .single();

        if (memberError || !membership) {
          throw new Error('Access denied: You are not a member of this private basket');
        }
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        goalAmount: data.goal_amount,
        currentAmount: data.current_amount,
        currency: data.currency,
        country: data.country,
        creatorDisplayName: data.users?.display_name,
        creatorAvatarUrl: data.users?.avatar_url,
        creatorMomoNumber: data.users?.mobile_money_number || data.users?.phone_number,
        isPrivate: data.is_private
      };
    },
    enabled: !!id,
    retry: 1
  });

  const formatNumber = (value: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '');
    // Add commas for thousands
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatNumber(value);
    setAmount(formattedValue);
  };

  const handleContribute = async () => {
    console.log('[CONTRIBUTE_PAGE] Starting contribution process...');
    if (!amount || !basketData) {
      toast({
        title: "Missing Information",
        description: "Please enter the amount",
        variant: "destructive"
      });
      return;
    }

    const numericAmount = Number(amount.replace(/,/g, ''));
    if (numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    console.log(`[CONTRIBUTE_PAGE] Processing amount: ${numericAmount} for basket: ${basketData.id}`);

    try {
      // 1️⃣ Generate the Mobile-Money USSD code via RPC
      console.log('[CONTRIBUTE_PAGE] Generating momo code...');
      const { data: momoCode, error: momoError } = await supabase.rpc('generate_momo_code', {
        p_basket_id: basketData.id,
        p_amount: numericAmount
      });

      if (momoError) {
        console.error('[CONTRIBUTE_PAGE_ERROR] Failed to generate momo code:', momoError);
        throw new Error(`Failed to generate payment code: ${momoError.message}`);
      }

      if (!momoCode) {
        console.error('[CONTRIBUTE_PAGE_ERROR] RPC returned no momoCode.');
        throw new Error('Could not generate payment code. Please try again.');
      }

      console.log(`[CONTRIBUTE_PAGE] momoCode generated: ${momoCode}`);

      // 2️⃣ Persist the contribution (optimistically) – respect RLS
      const { data: userResponse } = await supabase.auth.getUser();
      const userId = userResponse.user?.id;

      const { error: insertError } = await supabase.from('contributions').insert([
        {
          basket_id: basketData.id,
          user_id: userId,
          amount_local: numericAmount,
          currency: basketData.currency || 'RWF',
          payment_method: 'ussd',
          momo_code: momoCode,
          confirmed: false
        }
      ]);

      if (insertError) {
        console.error('[CONTRIBUTE_PAGE_ERROR] Failed to insert contribution:', insertError);
        throw new Error('Failed to log contribution. Please try again.');
      }

      // 3️⃣ Launch phone dialer with encoded USSD string
      console.log('[CONTRIBUTE_PAGE] Launching phone dialer...');
      window.location.href = `tel:${encodeURIComponent(momoCode)}`;

      // 4️⃣ Show success UI
      console.log('[CONTRIBUTE_PAGE] Showing success modal...');
      setContributedAmount(numericAmount);
      setShowSuccessModal(true);
      setAmount('');

      // Show toast notification
      toast({
        title: "Payment Initiated",
        description: "Complete the payment on your phone",
      });

      console.log('[CONTRIBUTE_PAGE] Contribution process complete.');

    } catch (error: any) {
      console.error('[CONTRIBUTE_PAGE_ERROR] Caught exception:', error);
      toast({
        title: "Contribution Failed",
        description: error.message || 'Failed to initiate contribution. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      console.log('[CONTRIBUTE_PAGE] Finished, processing set to false.');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate(`/basket/${id}`);
  };

  const handleRetry = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="w-8 h-8 rounded-lg mr-4" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <div className="px-6 space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !basketData) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    const isAccessDenied = errorMessage.includes('Access denied') || errorMessage.includes('cannot contribute');
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isAccessDenied ? 'Cannot Contribute' : 'Basket Not Found'}
          </h3>
          <p className="text-gray-400 mb-6">
            {errorMessage}
          </p>
          <div className="space-y-3">
            {!isAccessDenied && (
              <GradientButton onClick={handleRetry} className="w-full">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </GradientButton>
            )}
            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
            >
              Go Back
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold truncate">Contribute to Basket</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Basket Info */}
        <GlassCard className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={basketData.creatorAvatarUrl} alt={basketData.title} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                {basketData.title.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold gradient-text text-center line-clamp-2 mb-2">
                {basketData.title}
              </h2>
              <p className="text-sm text-gray-400">
                by {basketData.creatorDisplayName || 'Anonymous'}
              </p>
              <div className="mt-2 text-sm text-gray-300">
                Goal: {formatCurrency(basketData.goalAmount, basketData.currency)} {basketData.currency}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Contribution Form */}
        <GlassCard className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300 truncate">
                Amount ({basketData.currency})
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="1,000"
                  className="w-full pl-14 pr-4 py-4 text-lg rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {basketData.creatorMomoNumber && (
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300 truncate">
                  Payment Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={basketData.creatorMomoNumber}
                    readOnly
                    className="w-full pl-14 pr-4 py-4 text-lg rounded-lg bg-gray-100/10 border border-white/10 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <GradientButton
                variant="primary"
                className="w-full py-4 text-lg"
                onClick={handleContribute}
                loading={isProcessing}
                disabled={!amount}
              >
                <span className="truncate">
                  {isProcessing ? 'Processing Payment...' : 'Pay with Mobile Money'}
                </span>
              </GradientButton>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full px-4 py-4 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-center truncate"
              >
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Additional Info */}
        <GlassCard className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 truncate">
              Secure payment powered by Mobile Money
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Country: {basketData.country} • Currency: {basketData.currency}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Success Modal */}
      <ContributionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        amount={contributedAmount}
        basketName={basketData.title}
        basketId={basketData.id}
      />
    </div>
  );
};
