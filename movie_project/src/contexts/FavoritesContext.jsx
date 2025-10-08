import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for favorites
  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Safety timeout to prevent infinite loading if Firestore query is blocked
    const timeoutId = setTimeout(() => {
      console.error('⏰ Firestore query timeout after 10 seconds');
      console.error('❌ This usually means Firestore security rules are missing or incorrect');
      console.error('📋 Please add these rules in Firebase Console → Firestore Database → Rules:');
      console.error(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
      `);
      setLoading(false);
      setFavorites([]);
    }, 10000); // 10 second timeout

    const favoritesRef = collection(db, 'users', currentUser.uid, 'favorites');
    const q = query(favoritesRef);

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        clearTimeout(timeoutId);
        const favs = [];
        snapshot.forEach((doc) => {
          favs.push({
            id: doc.id,
            ...doc.data()
          });
        });
        console.log(`✅ Loaded ${favs.length} favorites from Firestore`);
        setFavorites(favs);
        setLoading(false);
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('❌ Firestore error fetching favorites:', error);
        console.error('🔒 Check if Firestore security rules are configured correctly');
        console.error('📋 Required rules:');
        console.error(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
        `);
        setLoading(false);
        setFavorites([]);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [currentUser]);

  // Add to favorites with optimistic update
  const addToFavorites = async (movie) => {
    if (!currentUser) {
      console.log('❌ Cannot add favorite: User not logged in');
      return;
    }

    console.log('➕ Adding to favorites:', movie.title);

    // Optimistic update
    const newFavorite = {
      id: `temp-${movie.id}`,
      movieId: Number(movie.id), // Ensure it's stored as a number
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      rating: movie.rating,
      year: movie.year,
      genre: movie.genre,
      overview: movie.overview,
      addedAt: new Date().toISOString()
    };
    setFavorites(prev => [...prev, newFavorite]);

    try {
      const favoritesRef = collection(db, 'users', currentUser.uid, 'favorites');
      await addDoc(favoritesRef, {
        movieId: Number(movie.id), // Ensure it's stored as a number
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        rating: movie.rating,
        year: movie.year,
        genre: movie.genre,
        overview: movie.overview,
        addedAt: new Date().toISOString()
      });
      console.log('✅ Added to favorites successfully');
      toast.success(`Added "${movie.title}" to favorites!`);
    } catch (error) {
      console.error('❌ Error adding favorite:', error);
      
      // Show user-friendly error based on error code
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Firestore rules not configured!');
        console.error('🔒 FIRESTORE SECURITY RULES MISSING!');
        console.error('📋 Follow the instructions in FIRESTORE_SETUP.md');
        console.error('🔗 Or check the console for the required rules');
      } else if (error.code === 'unavailable') {
        toast.error('Firestore service unavailable. Check internet connection.');
      } else {
        toast.error('Failed to add to favorites. Check console for details.');
      }
      
      // Revert optimistic update on error
      setFavorites(prev => prev.filter(f => f.id !== newFavorite.id));
    }
  };

  // Remove from favorites with optimistic update
  const removeFromFavorites = async (movieId) => {
    if (!currentUser) {
      console.log('❌ Cannot remove favorite: User not logged in');
      return;
    }

    console.log('➖ Removing from favorites, movieId:', movieId);

    // Optimistic update
    const originalFavorites = [...favorites];
    setFavorites(prev => prev.filter(f => Number(f.movieId) !== Number(movieId)));

    try {
      const favoritesRef = collection(db, 'users', currentUser.uid, 'favorites');
      const q = query(favoritesRef, where('movieId', '==', Number(movieId))); // Ensure numeric comparison
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', document.id));
      });
      console.log('✅ Removed from favorites successfully');
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('❌ Error removing favorite:', error);
      
      // Show user-friendly error
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Firestore rules not configured!');
        console.error('🔒 FIRESTORE SECURITY RULES MISSING!');
      } else {
        toast.error('Failed to remove from favorites');
      }
      
      // Revert optimistic update on error
      setFavorites(originalFavorites);
    }
  };

  // Check if movie is favorited
  const isFavorite = (movieId) => {
    // Convert both to numbers for comparison to handle type mismatches
    const result = favorites.some(fav => Number(fav.movieId) === Number(movieId));
    console.log(`🔍 Checking if movie ${movieId} is favorite:`, result, 'Favorites:', favorites.map(f => f.movieId));
    return result;
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
