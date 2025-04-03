import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from './useRedux';
import { login, register, logout, getCurrentUser } from '../redux/slices/authSlice';

interface UseAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  roles?: Array<'admin' | 'contributor' | 'reviewer' | 'viewer'>;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const { requireAuth = false, redirectTo = '/auth/login', roles = [] } = options;
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const initAuth = async () => {
      if (token && !isAuthenticated && !user) {
        // If we have a token but no user data, fetch the current user
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (err) {
          // If we can't get the user, clear the token and redirect to login
          dispatch(logout());
          if (requireAuth) {
            router.push(redirectTo);
          }
        }
      } else if (requireAuth && !token) {
        // If auth is required but no token exists, redirect to login
        router.push(redirectTo);
      }
      
      setIsInitialized(true);
    };
    
    initAuth();
  }, [dispatch, token, isAuthenticated, user, requireAuth, redirectTo, router]);
  
  // Check role permissions
  useEffect(() => {
    if (isInitialized && requireAuth && roles.length > 0 && user) {
      if (!roles.includes(user.role)) {
        // Redirect to dashboard if user doesn't have required role
        router.push('/dashboard');
      }
    }
  }, [isInitialized, requireAuth, roles, user, router]);
  
  const loginUser = async (email: string, password: string) => {
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  };
  
  const registerUser = async (name: string, email: string, password: string, tenantId?: string) => {
    try {
      const result = await dispatch(register({ name, email, password, tenantId })).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  };
  
  const logoutUser = () => {
    dispatch(logout());
    router.push('/auth/login');
  };
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    loginUser,
    registerUser,
    logoutUser,
  };
};
