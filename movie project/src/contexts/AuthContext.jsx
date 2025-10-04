// Minimal AuthContext - NO Firebase imports yet, just React Context pattern
import React, { createContext, useContext, useState } from 'react'

// Create the context
const AuthContext = createContext({})

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // Simple state for now - no Firebase yet
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Mock functions for now - will add Firebase later
  const login = async (email, password) => {
    console.log('Login called with:', email)
    // TODO: Add Firebase login
  }

  const signup = async (email, password) => {
    console.log('Signup called with:', email)
    // TODO: Add Firebase signup
  }

  const logout = async () => {
    console.log('Logout called')
    // TODO: Add Firebase logout
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('🔧 AuthProvider state initialized - loading:', loading);

  // ✅ SIGNUP FUNCTION - Creates new user account
  const signup = async (email, password, name) => {
    console.log('🔑 Starting signup process for:', email);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User account created:', userCredential.user.email);
      
      await updateProfile(userCredential.user, { displayName: name });
      console.log('✅ User profile updated with name:', name);
      
      setCurrentUser({
        ...userCredential.user,
        displayName: name
      });
      
      return userCredential;
    } catch (error) {
      console.error("❌ Error during signup:", error.message);
      throw error;
    }
  };

  // 🔑 LOGIN FUNCTION
  const login = (email, password) => {
    console.log('🚀 Attempting login for:', email);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 👋 LOGOUT FUNCTION
  const logout = () => {
    console.log('👋 Logging out user...');
    return signOut(auth);
  };

  // 👂 Listen for Authentication Changes
  useEffect(() => {
    console.log('👂 Setting up auth state listener...');
    
    try {
      const unsubscribe = onAuthStateChanged(auth, 
        (user) => {
          console.log('ℹ️ Auth state changed. User:', user?.email || 'none');
          setCurrentUser(user);
          setLoading(false);
          setError(null); // Clear any previous errors
        },
        (authError) => {
          console.error('❌ Auth state change error:', authError);
          setError(authError);
          setLoading(false);
        }
      );

      return () => {
        console.log('🧹 Cleaning up auth state listener.');
        try {
          unsubscribe();
        } catch (cleanupError) {
          console.error('❌ Error during auth cleanup:', cleanupError);
        }
      };
    } catch (setupError) {
      console.error('❌ Error setting up auth listener:', setupError);
      setError(setupError);
      setLoading(false);
    }
  }, []);

  // 📦 Package Everything
  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
    error
  };

  console.log('🔍 AuthProvider about to render - value:', value, 'children:', !!children);
  
  // Safety check to ensure we never return undefined
  if (!children) {
    console.error('❌ AuthProvider: children is undefined!');
    return <div>AuthProvider Error: No children provided</div>;
  }

  // If there's an error, display it
  if (error) {
    console.error('❌ AuthProvider: Firebase error detected:', error);
    return (
      <div style={{ padding: '20px', background: '#ffe6e6', border: '1px solid red' }}>
        <h3>🔥 Firebase Configuration Error</h3>
        <p><strong>Error:</strong> {error.message}</p>
        <p><strong>Code:</strong> {error.code}</p>
        <details>
          <summary>Full Error</summary>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </details>
      </div>
    );
  }

  try {
    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    );
  } catch (renderError) {
    console.error('❌ AuthProvider render error:', renderError);
    return <div>Auth Provider Render Error: {renderError.message}</div>;
  }
}
