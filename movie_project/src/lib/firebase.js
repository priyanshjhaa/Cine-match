import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, query, getDocs, limit } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

console.log('🔥 Initializing Firebase...')
console.log('Firebase Project ID:', firebaseConfig.projectId)

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

console.log('✅ Firebase initialized successfully')
console.log('Auth:', auth ? 'Ready' : 'Failed')
console.log('Firestore:', db ? 'Ready' : 'Failed')

// Test Firestore connection (runs once on app startup)
const testFirestoreConnection = async () => {
  try {
    // Try to read from a test collection
    const testRef = collection(db, '_health_check_')
    const q = query(testRef, limit(1))
    await getDocs(q)
    console.log('✅ Firestore connection test: SUCCESS')
  } catch (error) {
    console.warn('⚠️ Firestore connection test: FAILED')
    
    if (error.code === 'permission-denied') {
      console.error('')
      console.error('🚨 CRITICAL: FIRESTORE SECURITY RULES NOT CONFIGURED!')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('Your favorites will NOT persist after page refresh!')
      console.error('')
      console.error('📋 SOLUTION: Add security rules in Firebase Console')
      console.error('   1. Go to: https://console.firebase.google.com/')
      console.error('   2. Select your project: ' + firebaseConfig.projectId)
      console.error('   3. Navigate: Firestore Database → Rules tab')
      console.error('   4. Paste the rules from FIRESTORE_SETUP.md')
      console.error('   5. Click "Publish"')
      console.error('')
      console.error('📖 Full guide: See FIRESTORE_SETUP.md in project root')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('')
    } else {
      console.error('Firestore error:', error.code, error.message)
    }
  }
}

// Run the test after a short delay to not block app initialization
setTimeout(testFirestoreConnection, 1000)

console.log('📋 If you see issues with favorites, check FIRESTORE_SETUP.md')

export default app
