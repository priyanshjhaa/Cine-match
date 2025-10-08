
import React, { useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { AuthContext } from './AuthContextDefinition'

// Named export - provider component ONLY
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true) // Important: start with true

  // Listen for auth state changes with proper debugging
  useEffect(() => {
    console.log('🔥 AuthProvider mounting...')
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Auth state changed:', user?.email || 'No user')
      setCurrentUser(user)
      setLoading(false) // Always set loading to false
    })
    
    return () => {
      console.log('🔥 AuthProvider unmounting...')
      unsubscribe()
    }
  }, [])

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1220] via-[#0c1b2e] to-[#071524]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Initializing authentication...</p>
        </div>
      </div>
    )
  }

  // Named export functions
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth)
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
