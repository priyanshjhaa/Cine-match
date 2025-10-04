// 🔑 LOGIN PAGE - Handles user authentication
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext';  // 🎣 Get auth functions - TEMPORARILY DISABLED
import Header from '../components/Header.jsx'

function Login() {
  // 📊 LOCAL STATE - Manages form data and UI state  
  const [email, setEmail] = useState('')             // User's email input
  const [password, setPassword] = useState('')       // User's password input
  const [loading, setLoading] = useState(false)      // Shows loading during login
  const [error, setError] = useState('')             // Shows error messages
  
  // 🎣 GET AUTH FUNCTIONS - From our AuthContext - TEMPORARILY DISABLED
  // const { login } = useAuth()           // Get the login function we created
  const login = async () => console.log('Login temporarily disabled'); // Mock function
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
      navigate('/')                     // Redirect to home page on success
      
    } catch (error) {
      // 🚨 HANDLE ERRORS
      console.error('❌ Login error:', error)
      setError('Failed to log in: ' + error.message)
    } finally {
      // 🏁 CLEANUP - Always runs regardless of success/failure
      setLoading(false)                 // Stop loading state
      console.log('🏁 Login process completed')
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
                <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
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

            <p className="text-white/60 text-center mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
