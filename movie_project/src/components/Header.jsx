import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Header({ rightActions }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setShowDropdown(false)
      navigate('/')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

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
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-teal-400/30 rounded-full hover:bg-white/20 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm hidden sm:inline">
                {currentUser.displayName || 'User'}
              </span>
              <svg className={`w-4 h-4 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0f1937] border border-teal-400/30 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white font-semibold text-sm">{currentUser.displayName || 'User'}</p>
                  <p className="text-gray-400 text-xs truncate">{currentUser.email}</p>
                </div>
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-white hover:bg-teal-500/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-white hover:bg-teal-500/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm">Favorites</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-white hover:bg-red-500/20 transition-colors w-full text-left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
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
