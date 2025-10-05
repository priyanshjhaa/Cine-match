import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

// Add a movie to user's favorites
export const addFavorite = async (userId, movie) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    await addDoc(favoritesRef, {
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      rating: movie.rating,
      year: movie.year,
      genre: movie.genre,
      overview: movie.overview,
      addedAt: new Date().toISOString()
    });
    console.log('✅ Movie added to favorites');
  } catch (error) {
    console.error('❌ Error adding favorite:', error);
    throw error;
  }
};

// Remove a movie from user's favorites
export const removeFavorite = async (userId, movieId) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const q = query(favoritesRef, where('movieId', '==', movieId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'users', userId, 'favorites', document.id));
    });
    console.log('✅ Movie removed from favorites');
  } catch (error) {
    console.error('❌ Error removing favorite:', error);
    throw error;
  }
};

// Get all favorites for a user
export const getFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const querySnapshot = await getDocs(favoritesRef);
    
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return favorites;
  } catch (error) {
    console.error('❌ Error getting favorites:', error);
    return [];
  }
};

// Check if a movie is in user's favorites
export const isFavorite = async (userId, movieId) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const q = query(favoritesRef, where('movieId', '==', movieId));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('❌ Error checking favorite:', error);
    return false;
  }
};
