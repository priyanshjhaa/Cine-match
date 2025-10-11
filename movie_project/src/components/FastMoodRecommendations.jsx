// Fast and simple mood-based movie recommendations
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStreamingProviders } from '../services/tmdbApi'

// Simplified mood-to-genre mapping for speed
const MOOD_GENRES = {
  happy: [35, 16, 10751], // Comedy, Animation, Family
  sad: [18, 10749], // Drama, Romance
  excited: [28, 12, 878], // Action, Adventure, Sci-Fi
  calm: [99, 36, 10402], // Documentary, History, Music
  angry: [28, 80, 53], // Action, Crime, Thriller
  romantic: [10749, 35], // Romance, Comedy
  adventurous: [12, 28, 14], // Adventure, Action, Fantasy
  scared: [27, 53], // Horror, Thriller
  contemplative: [18, 99, 9648] // Drama, Documentary, Mystery
}

const FastMoodRecommendations = ({ moodResult, onClose }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [streamingData, setStreamingData] = useState({})

  useEffect(() => {
    console.log('🎭 Mood recommendations - moodResult:', moodResult);
    if (moodResult?.mood) {
      console.log('🎬 Fetching movies for mood:', moodResult.mood);
      fetchMovies(moodResult.mood)
    } else {
      console.log('❌ No mood found in moodResult');
    }
  }, [moodResult])

  const fetchMovies = async (mood) => {
    console.log('📡 Starting fetch for mood:', mood);
    setLoading(true)
    setError(null)
    
    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY
      const genres = MOOD_GENRES[mood] || MOOD_GENRES.happy
      
      console.log('🎯 Using genres:', genres);
      
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genres.join(',')}&sort_by=popularity.desc&vote_average.gte=6.0&language=en-US&page=1`
      )
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json()
      console.log('📦 API response:', data);
      const movieResults = data.results?.slice(0, 12) || []
      console.log('✅ Found', movieResults.length, 'movies');
      setMovies(movieResults)

      // Fetch streaming data for each movie
      const streamingPromises = movieResults.map(async (movie) => {
        const providers = await getStreamingProviders(movie.id)
        return { [movie.id]: providers }
      })

      const streamingResults = await Promise.all(streamingPromises)
      const streamingMap = streamingResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      setStreamingData(streamingMap)

    } catch (err) {
      setError('Failed to load recommendations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Component to display streaming providers
  const StreamingInfo = ({ movieId }) => {
    const providers = streamingData[movieId]
    
    if (!providers) return null

    return (
      <div className="mt-2 space-y-1">
        {providers.streaming?.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-green-400">📺 Stream:</span>
            <div className="flex gap-1">
              {providers.streaming.slice(0, 3).map((provider, index) => (
                <span key={index} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                  {provider.provider_name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {providers.rent?.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-blue-400">💰 Rent:</span>
            <div className="flex gap-1">
              {providers.rent.slice(0, 2).map((provider, index) => (
                <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                  {provider.provider_name}
                </span>
              ))}
            </div>
          </div>
        )}

        {!providers.streaming?.length && !providers.rent?.length && (
          <div className="text-xs text-gray-400">
            📍 Check local theaters
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <p className="text-white mb-2">Finding perfect movies for your mood...</p>
        <p className="text-gray-400 text-sm">Including streaming availability</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => fetchMovies(moodResult?.mood)}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!moodResult) {
    return null
  }

  return (
    <div className="py-8 relative">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-all"
          title="Close recommendations"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Perfect for your {moodResult.mood} mood! 🎬
        </h2>
        <p className="text-gray-300">Here are some great recommendations with streaming info</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 px-4">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="group relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-teal-500/20"
          >
            <div className="aspect-[2/3] bg-gradient-to-br from-teal-900 to-cyan-900">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                  🎬
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-sm font-bold mb-2 line-clamp-2">{movie.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-white text-xs">{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-white/60 text-xs">• {movie.release_date?.split('-')[0]}</span>
                </div>
                
                {/* Streaming availability */}
                <StreamingInfo movieId={movie.id} />
              </div>
            </div>

            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-teal-400/50 transition-all duration-300"></div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FastMoodRecommendations
