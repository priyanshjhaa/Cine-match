import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

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
    const favoritesRef = collection(db, 'users', currentUser.uid, 'favorites');
    const q = query(favoritesRef);

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const favs = [];
        snapshot.forEach((doc) => {
          favs.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setFavorites(favs);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
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
    } catch (error) {
      console.error('❌ Error adding favorite:', error);
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
    } catch (error) {
      console.error('❌ Error removing favorite:', error);
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
