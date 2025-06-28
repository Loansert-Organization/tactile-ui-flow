import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn(() => ({
      auth: {
        signInAnonymously: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'anon-id' } } }, error: null }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'anon-id' } } } }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: {}, error: null }),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
      })),
    })),
  };
}); 