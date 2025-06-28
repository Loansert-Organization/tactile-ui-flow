import { useAuthContext } from '@/contexts/AuthContext';

export const useAdmin = () => {
  const { user } = useAuthContext();

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user' || !user?.role;

  const requireAdmin = () => {
    if (!isAdmin) {
      throw new Error('Admin access required');
    }
  };

  const withAdminCheck = <T extends any[], R>(
    fn: (...args: T) => R,
    fallback?: R
  ) => {
    return (...args: T): R => {
      if (!isAdmin) {
        if (fallback !== undefined) {
          return fallback;
        }
        throw new Error('Admin access required');
      }
      return fn(...args);
    };
  };

  return {
    isAdmin,
    isUser,
    requireAdmin,
    withAdminCheck
  };
}; 