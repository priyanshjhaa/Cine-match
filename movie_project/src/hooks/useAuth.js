// ========================================
// AUTH HOOK - FOR FUTURE USE
// Custom hook for accessing authentication context
// ========================================

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextDefinition';

export function useAuth() {
  console.log('🎣 useAuth hook called');
  const context = useContext(AuthContext);
  console.log('🎣 useAuth context value:', context);
  if (context === undefined) {
    console.error('❌ useAuth called outside AuthProvider!');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

