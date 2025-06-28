import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useWallet } from './useWallet';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the entire Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null
      })
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null })
    }))
  }
}));

describe('useWallet', () => {
  it('should process a wallet contribution and deduct balance', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useWallet(), { wrapper });
    // Mock wallet state
    act(() => {
      result.current.wallet = { id: 'wallet-1', user_id: 'anon-id', balance_usd: 10, last_updated: new Date().toISOString() };
    });
    await act(async () => {
      await result.current.processContribution('basket-1', 1000, 1, 'RWF', 'wallet');
    });
    // After deduction, balance should be 9
    expect(result.current.wallet?.balance_usd).toBeLessThanOrEqual(9);
  });
}); 