import React from 'react';
import { LoginModal } from './LoginModal';
import { SignUpModal } from './SignUpModal';
import { SubscriptionTier, Tenant } from '../data/mockTenants';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onAuthSuccess: (tenant: Tenant, email?: string) => void;
  initialTier?: SubscriptionTier;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
  onAuthSuccess,
  initialTier = 'FREE'
}) => {
  if (!isOpen) return null;

  if (mode === 'login') {
    return (
      <LoginModal
        isOpen={isOpen}
        onClose={onClose}
        onSwitchToSignUp={() => onSwitchMode('signup')}
        onLoginSuccess={(tenant, email) => onAuthSuccess(tenant, email)}
      />
    );
  }

  return (
    <SignUpModal
      isOpen={isOpen}
      onClose={onClose}
      onSwitchToLogin={() => onSwitchMode('login')}
      onSignUpSuccess={(tenant) => onAuthSuccess(tenant)}
      initialTier={initialTier}
    />
  );
};
