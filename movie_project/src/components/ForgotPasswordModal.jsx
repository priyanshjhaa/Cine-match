
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
      toast.success('Password reset email sent! Check your inbox.')
      setTimeout(() => {
        onClose()
        setEmail('')
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Password reset error:', error)
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address')
        toast.error('No account found with this email')
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address')
        toast.error('Invalid email address')
      } else {
        setError('Failed to send reset email. Please try again.')
        toast.error('Failed to send reset email')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError('')
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1937] border border-teal-400/30 rounded-2xl p-8 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-white/60 text-sm mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
              Password reset email sent! Check your inbox.
            </div>
          )}

          <div>
            <label htmlFor="reset-email" className="block text-white/80 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={loading || success}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Sending...' : success ? 'Sent!' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordModal
