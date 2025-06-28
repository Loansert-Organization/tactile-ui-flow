import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuthContext } from './AuthContext';

// Mock the entire Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInAnonymously: vi.fn().mockResolvedValue({
        data: { user: { id: 'anon-id', email: null } },
        error: null
      }),
      signInWithOAuth: vi.fn().mockResolvedValue({
        data: { user: { id: 'oauth-id', email: 'test@example.com' } },
        error: null
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null
      })
    }
  }
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in anonymously and set user', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.signInAnonymous();
    });

    expect(result.current.user?.id).toBe('anon-id');
    expect(result.current.isLoggedIn).toBe(true);
  });
}); 