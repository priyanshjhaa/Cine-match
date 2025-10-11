// ✅ SIGNUP PAGE - Handles user registration
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header.jsx'

function Signup() {
  // 📊 LOCAL STATE - Manages form data and UI state
  const [name, setName] = useState('')               // User's full name
  const [email, setEmail] = useState('')             // User's email
  const [password, setPassword] = useState('')       // User's password
  const [loading, setLoading] = useState(false)      // Loading during signup
  const [error, setError] = useState('')             // Error messages
  
  // 🎣 GET AUTH FUNCTIONS - From our AuthContext - NOW ENABLED
  const { signup, loginWithGoogle } = useAuth()          // Get the signup function we created  
  const navigate = useNavigate()        // For redirecting after successful signup

  // 🚀 HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault()                  // Prevent page refresh
    console.log('✅ Signup form submitted for:', email)
    
    setError('')                        // Clear previous errors
    setLoading(true)                    // Show loading state

    // 🛡️ VALIDATION - Check password length (Firebase requirement)
    if (password.length < 6) {
      console.warn('⚠️ Password too short')
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      // 🎯 CALL OUR SIGNUP FUNCTION
      console.log('🔄 Calling signup function...')
      await signup(email, password, name)    // This creates the Firebase account
      
      console.log('✅ Signup successful! Redirecting to home page...')
      toast.success('Account created successfully! Welcome to CineMatch! 🎬')
      navigate('/')                           // Redirect to home page on success
      
    } catch (error) {
      // 🚨 HANDLE ERRORS
      console.error('❌ Signup error:', error)
      toast.error('Failed to create account. Please try again.')
      setError('Failed to create account: ' + error.message)
    } finally {
      // 🏁 CLEANUP - Always runs regardless of success/failure
      setLoading(false)                       // Stop loading state
      console.log('🏁 Signup process completed')
    }
  }

  // 🔵 HANDLE GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    setError('')
    setLoading(true)

    try {
      console.log('🔵 Google signup initiated...')
      await loginWithGoogle()
      console.log('✅ Google signup successful!')
      toast.success('Welcome to CineMatch! 🎬')
      navigate('/')
    } catch (error) {
      console.error('❌ Google signup error:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-up cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site.')
      } else {
        toast.error('Failed to sign up with Google')
      }
      setError('Failed to sign up with Google: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const rightActions = (
    <Link 
      to="/login" 
      className="px-4 py-2 text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
    >
      Login
    </Link>
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#050d1a] via-[#071426] to-[#050d1a]">
      <Header rightActions={rightActions} />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Join CineMatch</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Create a password (min 6 characters)"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0f1937] text-white/60">OR</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-white/60 text-center mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
