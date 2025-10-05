import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../contexts/FavoritesContext';
import PageTransition from '../components/PageTransition';
import Header from '../components/Header';

const Favorites = () => {
  const { currentUser } = useAuth();
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleRemove = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromFavorites(movieId);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1937] to-[#0a1628]">
        <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">My Favorites</h1>
            <div className="text-teal-400 text-lg font-semibold">
              {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-white">Loading favorites...</p>
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">💔</div>
              <h2 className="text-3xl font-bold text-white mb-4">No Favorites Yet</h2>
              <p className="text-gray-400 text-lg mb-8">
                Start adding movies to your favorites and they'll appear here!
              </p>
              <Link
                to="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Browse Movies
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
              {favorites.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.movieId}`}
                  className="group relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-teal-500/20"
                >
                  {/* Poster */}
                  <div className="aspect-[2/3] bg-gradient-to-br from-teal-900 to-cyan-900">
                    {movie.poster_path ? (
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                        🎬
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-sm font-bold mb-2 line-clamp-2">{movie.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-white text-xs">{movie.rating}</span>
                        <span className="text-white/60 text-xs">• {movie.year}</span>
                      </div>
                      <span className="inline-block px-2 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs text-teal-300">
                        {movie.genre}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemove(e, movie.movieId)}
                    className="absolute top-2 right-2 z-10 p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-teal-400/50 transition-all duration-300"></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default Favorites;
