import { useState, useEffect } from 'react';
import { authService, AuthState } from '../lib/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    signUp: authService.signUp.bind(authService),
    signIn: authService.signIn.bind(authService),
    signOut: authService.signOut.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    updateProfile: authService.updateProfile.bind(authService),
    upgradeSubscription: authService.upgradeSubscription.bind(authService),
    cancelSubscription: authService.cancelSubscription.bind(authService),
    hasFeatureAccess: authService.hasFeatureAccess.bind(authService)
  };
};