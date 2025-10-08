// Firebase configuration and initialization
// PURE Firebase file - no React imports, no circular dependencies
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Debug: Check environment variables are loaded
console.log('🔥 Firebase config loaded:', {
  apiKey: firebaseConfig.apiKey ? '✅ Present' : '❌ Missing',
  authDomain: firebaseConfig.authDomain ? '✅ Present' : '❌ Missing',
  projectId: firebaseConfig.projectId ? '✅ Present' : '❌ Missing'
})

// Initialize Firebase app ONLY ONCE
console.log('🔥 Initializing Firebase app...')
const app = initializeApp(firebaseConfig)
console.log('🔥 Firebase app initialized successfully')

// Initialize and export Firebase services (not the app itself)
console.log('🔥 Initializing Firebase Auth...')
export const auth = getAuth(app)
console.log('🔥 Firebase Auth initialized:', auth ? '✅ Success' : '❌ Failed')

// Note: Never call initializeApp inside components
// This file should be imported only by contexts, hooks, or helper modules
