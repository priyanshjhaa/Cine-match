import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import { AuthProvider } from './contexts/AuthProvider'
import { FavoritesProvider, useFavorites } from './contexts/FavoritesContext'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MovieDetails from './pages/MovieDetails'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import QuickMoodQuiz from './components/QuickMoodQuiz'
import FastMoodRecommendations from './components/FastMoodRecommendations'
import SkeletonGrid from './components/SkeletonGrid'
import { getTrendingMovies, getPopularMovies, searchMovies } from './services/tmdbApi'

function HomeContent() {
  const { currentUser } = useAuth()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [popularLoading, setPopularLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showMoodQuiz, setShowMoodQuiz] = useState(false)
  const [moodResult, setMoodResult] = useState(null)

  const handleQuickFavorite = (e, movie) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('💗 Heart button clicked for:', movie.title, 'ID:', movie.id)
    
    if (!currentUser) {
      console.log('❌ User not logged in, redirecting to login')
      window.location.href = '/login'
      return
    }
    
    const isFav = isFavorite(movie.id)
    console.log('🔍 Is favorited?', isFav)
    
    if (isFav) {
      removeFromFavorites(movie.id)
    } else {
      addToFavorites(movie)
    }
  }

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        setPopularLoading(true)
        
        const trendingMovies = await getTrendingMovies()
        if (trendingMovies && trendingMovies.length > 0) {
          setMovies(trendingMovies.slice(0, 10))
        }
        
        const popularMoviesData = await getPopularMovies()
        if (popularMoviesData && popularMoviesData.length > 0) {
          setPopularMovies(popularMoviesData.slice(0, 20))
        }
        
        setLoading(false)
        setPopularLoading(false)
      } catch (error) {
        console.error('Error loading movies:', error)
        setLoading(false)
        setPopularLoading(false)
      }
    }

    loadMovies()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const results = await searchMovies(searchQuery)
      setMovies(results || [])
    } catch (error) {
      console.error('Error searching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetToTrending = async () => {
    setSearchQuery('')
    try {
      setLoading(true)
      const trendingMovies = await getTrendingMovies()
      if (trendingMovies && trendingMovies.length > 0) {
        setMovies(trendingMovies.slice(0, 10))
      }
    } catch (error) {
      console.error('Error loading trending movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = (direction, container) => {
    const scrollContainer = document.querySelector(`.scroll-container-${container}`)
    if (scrollContainer) {
      const scrollAmount = 800
      if (direction === 'left') {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  const handleMoodSubmit = (mood) => {
    console.log('🎬 handleMoodSubmit called with:', mood);
    setMoodResult(mood)
    setShowMoodQuiz(false)
    console.log('✅ Mood quiz closed, result set');
  }

  const closeMoodResult = () => {
    console.log('❌ Closing mood results');
    setMoodResult(null)
  }

  return (
    <div>
      <Header />
      
      <div className='w-full flex flex-col items-center justify-center px-4 pt-8 pb-12'>
        <div className='flex justify-center mb-6'>
          <img 
            src='/hero-img.png' 
            alt='Movie Hero'
            className='w-full max-w-md h-auto object-contain rounded-2xl shadow-2xl drop-shadow-[0_0_30px_rgba(20,184,166,0.3)]'
          />
        </div>

        <h1 className='text-5xl sm:text-6xl md:text-7xl font-black text-center mb-8 bg-gradient-to-r from-white via-teal-300 to-cyan-400 text-transparent bg-clip-text drop-shadow-lg leading-tight'>
          Find Your Next<br />Favorite Movie
        </h1>
        <form onSubmit={handleSearch} className='w-full max-w-2xl relative'>
          <input
            type='text'
            placeholder='Search for movies...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full px-6 py-4 bg-white/10 border border-teal-400/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-teal-400 transition-colors backdrop-blur-sm'
          />
          <button 
            type="submit"
            className='absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-full text-white font-semibold hover:opacity-90 transition-opacity'
          >
            Search
          </button>
        </form>
        
        <div className='mt-6'>
          <button 
            onClick={() => setShowMoodQuiz(true)}
            className='px-8 py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-full text-white font-semibold hover:opacity-90 transition-opacity shadow-lg backdrop-blur-sm border border-teal-400/20'
          >
            🎭 Get Movies Based on Your Mood
          </button>
        </div>

        {searchQuery && (
          <button 
            onClick={resetToTrending}
            className='mt-4 text-teal-400 hover:text-teal-300 transition-colors text-sm flex items-center gap-2'
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear search and show trending
          </button>
        )}
      </div>

      {showMoodQuiz && (
        <QuickMoodQuiz 
          onClose={() => setShowMoodQuiz(false)}
          onMoodDetected={handleMoodSubmit}
        />
      )}

      {moodResult && (
        <FastMoodRecommendations 
          moodResult={moodResult}
          onClose={closeMoodResult}
        />
      )}

      <div className='pb-16'>
        {!searchQuery && (
          <div className='mb-16'>
            <div className='flex items-center justify-between px-4 mb-6'>
              <div className='flex items-center gap-3'>
                <div className='w-1 h-8 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full'></div>
                <h2 className='text-white text-3xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text'>
                  Top 10 Trending
                </h2>
              </div>
              <div className='flex-1 h-px bg-gradient-to-r from-teal-400/50 to-transparent'></div>
              <div className='text-teal-400 text-sm font-medium'>
                This Week
              </div>
            </div>
            
            {loading ? (
              <SkeletonGrid count={10} variant="trending" />
            ) : movies.length === 0 ? (
              <div className='text-center py-20'>
                <div className='text-8xl mb-6'>🔍</div>
                <h2 className='text-3xl font-bold text-white mb-4'>
                  No movies available
                </h2>
                <p className='text-gray-400 text-lg mb-8'>
                  Unable to load movies at this time.
                </p>
              </div>
            ) : (
              <div className='relative'>
                <div className='scroll-container-trending overflow-x-auto scrollbar-thin pb-4'>
                  <div className='flex gap-2 px-4 min-w-max'>
                    {movies.map((movie, index) => (
                      <div key={movie.id} className='relative flex items-end group'>
                        {!searchQuery && index < 10 && (
                          <div className='flex-shrink-0 mb-8 mr-4'>
                            <span className='text-7xl sm:text-8xl md:text-9xl font-black bg-gradient-to-b from-white/40 via-white/20 to-transparent text-transparent bg-clip-text leading-none block select-none pointer-events-none'>
                              {index + 1}
                            </span>
                          </div>
                        )}
                        
                        <Link
                          to={`/movie/${movie.id}`}
                          className='relative w-[220px] h-[330px] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-700 hover:scale-105 hover:rotate-1 flex-shrink-0 z-10 shadow-2xl hover:shadow-teal-500/20 -ml-3'
                        >
                          <div className='absolute inset-0 bg-gradient-to-br from-teal-500/30 via-cyan-400/30 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700 z-10'></div>
                          <div className='absolute inset-0 rounded-xl border border-transparent group-hover:border-teal-400/50 transition-all duration-700 z-30'></div>
                          
                          <div 
                            className='w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110'
                            style={{
                              backgroundImage: `url(${movie.poster_path || movie.backdrop_path || `https://source.unsplash.com/random/400x600?${movie.title.toLowerCase().replace(/ /g, '-')}`})`
                            }}
                          ></div>
                          
                          <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 z-20'>
                            <div className='absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700'>
                              <div className='bg-black/60 backdrop-blur-lg p-4 rounded-lg border border-teal-400/20 shadow-xl'>
                                <h3 className='text-white text-lg font-bold mb-2 line-clamp-2'>{movie.title}</h3>
                                <div className='flex items-center gap-2 mb-3'>
                                  <span className='text-amber-400 text-lg'>★</span>
                                  <span className='text-white text-sm font-semibold'>{movie.rating}</span>
                                  <span className='text-white/60 text-sm'>• {movie.year}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                  <span className='inline-block px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs text-teal-300 font-medium'>
                                    {movie.genre}
                                  </span>
                                  <div className='text-xs text-white/70'>
                                    #{index + 1} Trending
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                        
                        <button
                          onClick={(e) => handleQuickFavorite(e, movie)}
                          className='absolute top-2 right-2 z-40 p-2 bg-black/70 backdrop-blur-md rounded-full text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100'
                          title={isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <svg className="w-5 h-5 transition-all" fill={isFavorite(movie.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {!loading && movies.length > 0 && (
                  <>
                    <button 
                      onClick={() => handleScroll('left', 'trending')}
                      className='absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-lg border border-teal-400/30 text-teal-300 hover:from-teal-500/40 hover:to-cyan-500/40 hover:border-teal-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-teal-500/25'
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleScroll('right', 'trending')}
                      className='absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-lg border border-teal-400/30 text-teal-300 hover:from-teal-500/40 hover:to-cyan-500/40 hover:border-teal-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-teal-500/25'
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className='mb-16'>
          <div className='px-4 mb-6'>
            <h2 className='text-white text-3xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text'>
              Popular Movies
            </h2>
          </div>
          
          {popularLoading ? (
            <SkeletonGrid count={20} variant="default" />
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 px-4'>
              {popularMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className='group relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-teal-500/20'
                >
                  <div className='aspect-[2/3] bg-gradient-to-br from-teal-900 to-cyan-900'>
                    {movie.poster_path ? (
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-white text-4xl'>
                        🎬
                      </div>
                    )}
                  </div>
                  
                  <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute bottom-0 left-0 right-0 p-4'>
                      <h3 className='text-white text-sm font-bold mb-2 line-clamp-2'>{movie.title}</h3>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-yellow-400 text-sm'>★</span>
                        <span className='text-white text-xs'>{movie.rating}</span>
                        <span className='text-white/60 text-xs'>• {movie.year}</span>
                      </div>
                      <span className='inline-block px-2 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs text-teal-300'>
                        {movie.genre}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleQuickFavorite(e, movie)}
                    className='absolute top-2 right-2 z-10 p-2 bg-black/70 backdrop-blur-md rounded-full text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100'
                    title={isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg className="w-5 h-5 transition-all" fill={isFavorite(movie.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <div className='absolute inset-0 rounded-xl border border-transparent group-hover:border-teal-400/50 transition-all duration-300'></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0f1937',
                color: '#fff',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#14b8a6',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <div className='min-h-screen w-full bg-gradient-to-b from-[#0a1628] via-[#0f1937] to-[#0a1628]'>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/" element={<HomeContent />} />
            </Routes>
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
