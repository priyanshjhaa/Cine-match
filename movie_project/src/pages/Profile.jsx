import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../contexts/FavoritesContext';
import PageTransition from '../components/PageTransition';
import Header from '../components/Header';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [updateNameSuccess, setUpdateNameSuccess] = useState('');
  const [updateNameError, setUpdateNameError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setDisplayName(currentUser.displayName || '');
  }, [currentUser, navigate]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setUpdateNameSuccess('');
    setUpdateNameError('');
    setLoading(true);

    try {
      await updateProfile(currentUser, {
        displayName: displayName.trim()
      });
      toast.success('Profile updated successfully! ✓');
      setUpdateNameSuccess('Profile updated successfully!');
      setTimeout(() => setUpdateNameSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
      setUpdateNameError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      
      toast.success('Password updated successfully! ✓');
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
        setPasswordError('Current password is incorrect');
      } else {
        toast.error(`Failed to update password: ${error.message}`);
        setPasswordError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  const joinDate = currentUser.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Unknown';

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1937] to-[#0a1628]">
        <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>
          
          {/* User Info Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-teal-400/20 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{currentUser.displayName || 'User'}</h2>
                <p className="text-gray-400">{currentUser.email}</p>
                <p className="text-gray-500 text-sm mt-1">Member since {joinDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Favorites</p>
                <p className="text-3xl font-bold text-white">{favorites.length}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Account Type</p>
                <p className="text-lg font-semibold text-teal-400">Free</p>
              </div>
            </div>
          </div>

          {/* Edit Profile Name */}
          <div className="bg-white/5 backdrop-blur-sm border border-teal-400/20 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Profile</h3>
            
            <form onSubmit={handleUpdateName} className="space-y-4">
              {updateNameSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                  {updateNameSuccess}
                </div>
              )}
              
              {updateNameError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {updateNameError}
                </div>
              )}
              
              <div>
                <label htmlFor="displayName" className="block text-white/80 text-sm font-medium mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Enter your display name"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !displayName.trim()}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white/5 backdrop-blur-sm border border-teal-400/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Change Password</h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {passwordSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                  {passwordSuccess}
                </div>
              )}
              
              {passwordError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {passwordError}
                </div>
              )}
              
              <div>
                <label htmlFor="currentPassword" className="block text-white/80 text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Enter current password"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-white/80 text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Enter new password (min 6 characters)"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-white/80 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
