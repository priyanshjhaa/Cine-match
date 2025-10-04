// 🎯 HEADER COMPONENT - Shows different UI based on auth state
import React from 'react'
import { Link } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'  // 🎣 Get auth data via hook - TEMPORARILY DISABLED

function Header({ rightActions }) {
  // 🎣 GET CURRENT USER AND LOGOUT FUNCTION - TEMPORARILY DISABLED FOR DEBUGGING
  // const { currentUser, logout } = useAuth()   // currentUser will be null if not logged in
  const currentUser = null;
  const logout = () => console.log('logout disabled temporarily');

  // 👋 LOGOUT HANDLER
  const handleLogout = async () => {
    console.log('👋 User clicked logout button')
    try {
      await logout()                          // Call our logout function
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Failed to log out:', error)
    }
  }

  // If rightActions are provided (from login/signup pages), use them
  if (rightActions) {
    return (
      <header className="w-full px-3 sm:px-4 py-3 flex items-center justify-between z-40 bg-transparent">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
              <img src="/cinematch-logo.png" alt="CineMatch logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-semibold text-xl sm:text-2xl tracking-wide">CineMatch</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {rightActions}
        </div>
      </header>
    )
  }

  // Default header with conditional auth UI
  return (
    <header className="w-full px-3 sm:px-4 py-3 flex items-center justify-between z-40 bg-transparent">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
            <img src="/cinematch-logo.png" alt="CineMatch logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-semibold text-xl sm:text-2xl tracking-wide">CineMatch</span>
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 🔀 CONDITIONAL RENDERING - Show different UI based on auth state */}
        {currentUser ? (
          // ✅ USER IS LOGGED IN - Show welcome message and logout button
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-sm">
              Welcome, {currentUser.displayName || currentUser.email}!
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        ) : (
          // ❌ USER IS NOT LOGGED IN - Show login and signup buttons
          <>
            <Link 
              to="/login" 
              className="px-4 py-2 text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 text-white border border-teal-400/30 rounded-full hover:bg-teal-500/10 transition-colors text-sm sm:text-base"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header