// Simple Firebase test component - isolated on /test route
import { auth, app } from '../lib/firebase.js'

export default function FirebaseTest() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>
        
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">✅ Firebase Initialized Successfully</h2>
          <p><strong>Project ID:</strong> {app.options.projectId}</p>
          <p><strong>Auth Domain:</strong> {app.options.authDomain}</p>
          <p><strong>Auth Instance:</strong> {auth ? 'Connected' : 'Not connected'}</p>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Test Status:</h3>
          <p>If you can see this page, Firebase imports are working correctly!</p>
        </div>
        
        <div className="mt-6">
          <a 
            href="/" 
            className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
