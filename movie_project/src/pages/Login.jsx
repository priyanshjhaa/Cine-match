// 🔑 LOGIN PAGE - Handles user authentication
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header.jsx'
import ForgotPasswordModal from '../components/ForgotPasswordModal'

function Login() {
  // 📊 LOCAL STATE - Manages form data and UI state  
  const [email, setEmail] = useState('')             // User's email input
  const [password, setPassword] = useState('')       // User's password input
  const [loading, setLoading] = useState(false)      // Shows loading during login
  const [error, setError] = useState('')             // Shows error messages
  const [showForgotModal, setShowForgotModal] = useState(false)  // Shows forgot password modal
  
  // 🎣 GET AUTH FUNCTIONS - From our AuthContext - NOW ENABLED
  const { login, loginWithGoogle } = useAuth()           // Get the login function we created
  const navigate = useNavigate()        // For redirecting after successful login

  // 🚀 HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault()                  // Prevent page refresh
    console.log('🔑 Login form submitted for:', email)
    
    setError('')                        // Clear any previous errors
    setLoading(true)                    // Show loading state

    try {
      // 🎯 CALL OUR LOGIN FUNCTION
      console.log('🔄 Calling login function...')
      await login(email, password)     // This calls Firebase authentication
      
      console.log('✅ Login successful! Redirecting to home page...')
      toast.success('Welcome back! 👋')
      navigate('/')                     // Redirect to home page on success
      
    } catch (error) {
      // 🚨 HANDLE ERRORS
      console.error('❌ Login error:', error)
      toast.error('Failed to log in. Please check your credentials.')
      setError('Failed to log in: ' + error.message)
    } finally {
      // 🏁 CLEANUP - Always runs regardless of success/failure
      setLoading(false)                 // Stop loading state
      console.log('🏁 Login process completed')
    }
  }

  // 🔵 HANDLE GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      console.log('🔵 Google login initiated...')
      await loginWithGoogle()
      console.log('✅ Google login successful!')
      toast.success('Welcome! 👋')
      navigate('/')
    } catch (error) {
      console.error('❌ Google login error:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site.')
      } else {
        toast.error('Failed to sign in with Google')
      }
      setError('Failed to sign in with Google: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const rightActions = (
    <Link 
      to="/signup" 
      className="px-4 py-2 text-white border border-teal-400/30 rounded-full hover:bg-teal-500/10 transition-colors text-sm sm:text-base"
    >
      Sign Up
    </Link>
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#050d1a] via-[#071426] to-[#050d1a]">
      <Header rightActions={rightActions} />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
              
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-white/80 text-sm font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
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
              onClick={handleGoogleLogin}
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
              Don't have an account?{' '}
              <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />
    </div>
  )
}

export default Login
