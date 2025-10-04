// ✅ SIGNUP PAGE - Handles user registration
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'  // 🎣 Get auth functions - NOW ENABLED
import Header from '../components/Header.jsx'

function Signup() {
  // 📊 LOCAL STATE - Manages form data and UI state
  const [name, setName] = useState('')               // User's full name
  const [email, setEmail] = useState('')             // User's email
  const [password, setPassword] = useState('')       // User's password
  const [loading, setLoading] = useState(false)      // Loading during signup
  const [error, setError] = useState('')             // Error messages
  
  // 🎣 GET AUTH FUNCTIONS - From our AuthContext - NOW ENABLED
  const { signup } = useAuth()          // Get the signup function we created  
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
      navigate('/')                           // Redirect to home page on success
      
    } catch (error) {
      // 🚨 HANDLE ERRORS
      console.error('❌ Signup error:', error)
      setError('Failed to create account: ' + error.message)
    } finally {
      // 🏁 CLEANUP - Always runs regardless of success/failure
      setLoading(false)                       // Stop loading state
      console.log('🏁 Signup process completed')
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
