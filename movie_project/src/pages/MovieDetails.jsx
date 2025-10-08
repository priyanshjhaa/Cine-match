import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieDetails, getStreamingProviders, getMovieVideos, getSimilarMovies } from '../services/tmdbApi';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../hooks/useAuth';
import PageTransition from '../components/PageTransition';
import StreamingProviders from '../components/StreamingProviders';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [movie, setMovie] = useState(null);
  const [streamingData, setStreamingData] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [movieData, streamingInfo, videoData, similar] = await Promise.all([
          getMovieDetails(id),
          getStreamingProviders(id),
          getMovieVideos(id),
          getSimilarMovies(id)
        ]);
        
        setMovie(movieData);
        setStreamingData(streamingInfo);
        setTrailer(videoData);
        setSimilarMovies(similar);
      } catch (err) {
        console.error('Error loading movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
    // Scroll to top when movie changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleToggleFavorite = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const isFav = isFavorite(id);
    if (isFav) {
      removeFromFavorites(parseInt(id));
    } else {
      addToFavorites({
        id: parseInt(id),
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        rating: movie.vote_average?.toFixed(1),
        year: releaseYear,
        genre: movie.genres?.[0]?.name || 'Unknown',
        overview: movie.overview
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1937] to-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1937] to-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Movie not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const director = movie.credits?.crew?.find(person => person.job === 'Director');
  const runtimeHours = Math.floor(movie.runtime / 60);
  const runtimeMinutes = movie.runtime % 60;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1937] to-[#0a1628]">
        {/* Backdrop Header */}
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        {movie.backdrop_path ? (
          <>
            <img
              src={movie.backdrop_path}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-900 to-cyan-900"></div>
        )}
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all flex items-center gap-2 border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all border border-white/10"
          title={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className="w-6 h-6 transition-all" fill={isFavorite(id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Movie Details Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-16 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-48 md:w-56 lg:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-teal-400/20">
              {movie.poster_path ? (
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-900 to-cyan-900 flex items-center justify-center">
                  <span className="text-white text-6xl">🎬</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {movie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
              <span className="flex items-center gap-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-white font-semibold">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-sm">({movie.vote_count} votes)</span>
              </span>
              <span>•</span>
              <span>{releaseYear}</span>
              {movie.runtime && movie.runtime !== 'N/A' && (
                <>
                  <span>•</span>
                  <span>{runtimeHours}h {runtimeMinutes}m</span>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-2 bg-teal-500/20 border border-teal-400/30 rounded-full text-sm text-teal-300 font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-base">
                {movie.overview}
              </p>
            </div>

            {/* Director */}
            {director && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">Director</h3>
                <p className="text-gray-300">{director.name}</p>
              </div>
            )}

            {/* Streaming Providers */}
            {streamingData && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">Where to Watch</h2>
                <StreamingProviders movieId={id} />
              </div>
            )}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">Cast</h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {movie.cast.slice(0, 16).map((actor, index) => (
                    <div key={index} className="text-center">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="w-full aspect-[3/4] object-cover rounded-md mb-1.5 border border-teal-400/20"
                        />
                      ) : (
                        <div className="w-full aspect-[3/4] bg-gradient-to-br from-teal-900/50 to-cyan-900/50 rounded-md mb-1.5 flex items-center justify-center border border-teal-400/20">
                          <span className="text-2xl">👤</span>
                        </div>
                      )}
                      <p className="text-white font-semibold text-xs mb-1 line-clamp-1">{actor.name}</p>
                      <p className="text-gray-400 text-xs line-clamp-1">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">Production</h2>
                <div className="flex flex-wrap gap-4">
                  {movie.production_companies.map((company, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      {company.logo_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                          alt={company.name}
                          className="h-8 object-contain"
                        />
                      ) : (
                        <span className="text-gray-300 text-sm">{company.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer Section */}
            {trailer && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-3xl">🎬</span>
                  Watch Trailer
                </h2>
                <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-teal-400/20">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                    title={trailer.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Similar Movies Section */}
            {similarMovies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-3xl">✨</span>
                  More Like This
                </h2>
                <div className="relative">
                  <div className="overflow-x-auto pb-4 scrollbar-visible">
                    <div className="flex gap-4 min-w-max">
                      {similarMovies.map((movie) => (
                        <Link
                          key={movie.id}
                          to={`/movie/${movie.id}`}
                          className="group relative w-[140px] md:w-[160px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 shadow-xl hover:shadow-teal-500/20"
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
                          
                          {/* Border glow on hover */}
                          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-teal-400/50 transition-all duration-300"></div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default MovieDetails;
