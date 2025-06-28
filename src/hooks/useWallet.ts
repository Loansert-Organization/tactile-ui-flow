import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface Wallet {
  id: string;
  user_id: string;
  balance_usd: number;
  last_updated: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount_usd: number;
  type: 'contribution' | 'topup' | 'withdrawal';
  related_basket?: string;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useAuthContext();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallet balance
  const fetchWallet = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching wallet:', error);
        setError('Failed to fetch wallet balance');
        return;
      }

      setWallet(data);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Wallet fetch error:', err);
      setError('Failed to fetch wallet');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch transaction history
  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', wallet?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Transaction fetch error:', err);
    }
  }, [user?.id, wallet?.id]);

  // Process contribution with wallet deduction
  const processContribution = useCallback(async (
    basketId: string,
    amountLocal: number,
    amountUsd: number,
    currency: string,
    paymentMethod: 'wallet' | 'ussd'
  ) => {
    if (!user?.id || !wallet) {
      throw new Error('User or wallet not found');
    }

    // For wallet payments, check balance and deduct
    if (paymentMethod === 'wallet') {
      if (wallet.balance_usd < amountUsd) {
        throw new Error('Insufficient wallet balance');
      }

      // Start transaction
      const { data: contribution, error: contributionError } = await supabase
        .from('contributions')
        .insert({
          basket_id: basketId,
          user_id: user.id,
          amount_local: amountLocal,
          amount_usd: amountUsd,
          currency,
          payment_method: paymentMethod,
          confirmed: true
        })
        .select()
        .single();

      if (contributionError) {
        if (import.meta.env.DEV) console.error('Contribution error:', contributionError);
        throw new Error('Failed to create contribution');
      }

      // Deduct from wallet
      const { error: walletError } = await supabase
        .from('wallets')
        .update({
          balance_usd: wallet.balance_usd - amountUsd,
          last_updated: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (walletError) {
        if (import.meta.env.DEV) console.error('Wallet update error:', walletError);
        throw new Error('Failed to update wallet balance');
      }

      // Create transaction log
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          wallet_id: wallet.id,
          amount_usd: -amountUsd,
          type: 'contribution',
          related_basket: basketId
        });

      if (transactionError) {
        if (import.meta.env.DEV) console.error('Transaction log error:', transactionError);
        // Don't throw here as contribution was successful
      }

      // Refresh wallet data
      await fetchWallet();
      await fetchTransactions();

      return contribution;
    }

    // For USSD payments, just create contribution record
    const { data: contribution, error: contributionError } = await supabase
      .from('contributions')
      .insert({
        basket_id: basketId,
        user_id: user.id,
        amount_local: amountLocal,
        amount_usd: amountUsd,
        currency,
        payment_method: paymentMethod,
        momo_code: `*182*1*${user.id.slice(-6)}*${amountLocal}#`,
        confirmed: false
      })
      .select()
      .single();

    if (contributionError) {
      if (import.meta.env.DEV) console.error('Contribution error:', contributionError);
      throw new Error('Failed to create contribution');
    }

    return contribution;
  }, [user?.id, wallet, fetchWallet, fetchTransactions]);

  // Top up wallet
  const topUpWallet = useCallback(async (amountUsd: number) => {
    if (!user?.id || !wallet) {
      throw new Error('User or wallet not found');
    }

    const { error } = await supabase
      .from('wallets')
      .update({
        balance_usd: wallet.balance_usd + amountUsd,
        last_updated: new Date().toISOString()
      })
      .eq('id', wallet.id);

    if (error) {
      if (import.meta.env.DEV) console.error('Wallet top-up error:', error);
      throw new Error('Failed to top up wallet');
    }

    // Create transaction log
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet.id,
        amount_usd: amountUsd,
        type: 'topup'
      });

    if (transactionError) {
      if (import.meta.env.DEV) console.error('Transaction log error:', transactionError);
    }

    // Refresh wallet data
    await fetchWallet();
    await fetchTransactions();
  }, [user?.id, wallet, fetchWallet, fetchTransactions]);

  return {
    wallet,
    transactions,
    loading,
    error,
    fetchWallet,
    fetchTransactions,
    processContribution,
    topUpWallet
  };
}; 