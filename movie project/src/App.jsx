import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header'
import { AuthProvider } from './contexts/AuthProvider'  // NOW ENABLED WITH PROPER LOADING
import Login from './pages/Login'
import Signup from './pages/Signup'
import MovieDetails from './pages/MovieDetails'
import QuickMoodQuiz from './components/QuickMoodQuiz'
import FastMoodRecommendations from './components/FastMoodRecommendations'
import { getTrendingMovies, getPopularMovies, searchMovies } from './services/tmdbApi'


function App() {
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [popularLoading, setPopularLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showMoodQuiz, setShowMoodQuiz] = useState(false)
  const [moodResult, setMoodResult] = useState(null)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        setPopularLoading(true)
        
        console.log('🎬 Starting to load movies...')
        
        // Load trending movies (limit to top 10)
        console.log('🔄 Attempting to load trending movies...')
        const trendingMovies = await getTrendingMovies()
        console.log('✅ Trending movies loaded:', trendingMovies?.length)
        if (trendingMovies && trendingMovies.length > 0) {
          setMovies(trendingMovies.slice(0, 10))
        } else {
          console.log('⚠️ No trending movies received')
        }
        
        // Load popular movies
        console.log('🔄 Attempting to load popular movies...')
        const popularMoviesData = await getPopularMovies()
        console.log('✅ Popular movies loaded:', popularMoviesData?.length)
        if (popularMoviesData && popularMoviesData.length > 0) {
          setPopularMovies(popularMoviesData.slice(0, 20))
        } else {
          console.log('⚠️ No popular movies received')
        }
        
      } catch (error) {
        console.error('❌ Error loading movies:', error)
        // The API functions should return fallback movies, so this shouldn't happen
        // But just in case, let's try to get fallback movies
        try {
          const { getFallbackMovies } = await import('./services/tmdbApi')
          const fallbackMovies = getFallbackMovies()
          console.log('🔄 Using fallback movies:', fallbackMovies.length)
          setMovies(fallbackMovies.slice(0, 10))
          setPopularMovies(fallbackMovies.slice(0, 20))
        } catch (fallbackError) {
          console.error('❌ Even fallback movies failed:', fallbackError)
          setMovies([])
          setPopularMovies([])
        }
      } finally {
        setLoading(false)
        setPopularLoading(false)
        console.log('🏁 Movies loading completed')
      }
    }

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('⚠️ Loading timeout - forcing completion')
      setLoading(false)
      setPopularLoading(false)
      setMovies([])
      setPopularMovies([])
    }, 10000) // 10 second timeout

    loadMovies().finally(() => {
      clearTimeout(timeoutId)
    })

    return () => clearTimeout(timeoutId)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const searchResults = await searchMovies(searchQuery)
      setMovies(searchResults.results || searchResults)
    } catch (error) {
      console.error('Error searching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = (direction, container = 'trending') => {
    const scrollContainer = document.querySelector(`.scroll-container-${container}`)
    if (scrollContainer) {
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - 500)
        : scrollPosition + 500
      scrollContainer.scrollLeft = newPosition
      setScrollPosition(newPosition)
    }
  }

  const resetToTrending = async () => {
    try {
      setLoading(true)
      setSearchQuery('')
      const trendingMovies = await getTrendingMovies()
      setMovies(trendingMovies.slice(0, 10))
    } catch (error) {
      console.error('Error loading trending movies:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthProvider>
      <Router>
        <div className='min-h-screen w-full bg-gradient-to-b from-[#0a1628] via-[#0f1937] to-[#0a1628]'>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading movies...</p>
            </div>
          </div>
        ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/" element={
            <>
              <Header 
                rightActions={
                  <div className="flex items-center gap-2 sm:gap-3">
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
                  </div>
                }
              />
              
              {/* Hero Section - Centered in viewport */}
              <div className='w-full flex flex-col items-center justify-center px-4 pt-8 pb-12'>
                <div className='flex justify-center mb-6'>
                  <img 
                    src='/hero-img.png' 
                    alt='Movie Hero'
                    className='w-[360px] h-auto object-contain filter drop-shadow-2xl'
                  />
                </div>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-center mb-6 max-w-4xl'>
                  Find <span className='bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-transparent bg-clip-text'>Movies</span> You'll Love
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
                
                {/* Mood Recommendation Button */}
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
                    className='mt-4 px-4 py-2 text-white/70 hover:text-white transition-colors'
                  >
                    ← Back to Trending
                  </button>
                )}
              </div>

              {/* Mood Quiz and Recommendations Section */}
              {showMoodQuiz && (
                <div className='w-full bg-gradient-to-b from-[#0f1937] to-[#0a1628] py-16'>
                  <div className='max-w-6xl mx-auto'>
                    {!moodResult ? (
                      <>
                        <div className='text-center mb-8'>
                          <h2 className='text-3xl font-bold text-white mb-4'>
                            🎭 Mood-Based Movie Recommendations
                          </h2>
                          <p className='text-gray-300 text-lg mb-6'>
                            Answer a few quick questions and we'll find the perfect movies for your current mood!
                          </p>
                          <button 
                            onClick={() => setShowMoodQuiz(false)}
                            className='text-gray-400 hover:text-white transition-colors'
                          >
                            ← Back to Browse
                          </button>
                        </div>
                        <QuickMoodQuiz onMoodDetected={setMoodResult} />
                      </>
                    ) : (
                      <>
                        <div className='text-center mb-8'>
                          <button 
                            onClick={() => {
                              setMoodResult(null)
                              setShowMoodQuiz(false)
                            }}
                            className='text-gray-400 hover:text-white transition-colors'
                          >
                            ← Back to Browse
                          </button>
                        </div>
                        <FastMoodRecommendations moodResult={moodResult} />
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Movies Section - Full width */}
              <div className='w-full min-h-screen bg-gradient-to-b from-[#0a1628]/20 to-[#0f1937]/60'>
                {/* Trending Movies Section */}
                <div className='w-full px-4 mb-16 relative'>
                  {/* Animated background pattern */}
                  <div className='absolute inset-0 opacity-5'>
                    <div className='absolute top-0 left-1/4 w-64 h-64 bg-teal-400 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute bottom-0 right-1/4 w-48 h-48 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-1000'></div>
                  </div>
                  
                  {/* Enhanced section header */}
                  <div className='relative z-10 flex items-center gap-4 mb-8'>
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
                    <div className='flex justify-center items-center h-64'>
                      <div className='text-white text-lg'>Loading movies...</div>
                    </div>
                  ) : (
                    <div className='relative'>
                      <div className='scroll-container-trending overflow-x-auto scrollbar-thin pb-4'>
                        <div className='flex gap-2 px-4 min-w-max'>
                          {movies.map((movie, index) => (
                            <div key={movie.id} className='relative flex items-end'>
                              {/* Number positioned to the left, movie card slightly overlaps */}
                              {!searchQuery && index < 10 && (
                                <div className='flex-shrink-0 mb-8 mr-4'>
                                  <span className='text-7xl sm:text-8xl md:text-9xl font-black bg-gradient-to-b from-white/40 via-white/20 to-transparent text-transparent bg-clip-text leading-none block select-none pointer-events-none'>
                                    {index + 1}
                                  </span>
                                </div>
                              )}
                              
                              <Link
                                to={`/movie/${movie.id}`}
                                className='group relative w-[220px] h-[330px] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-700 hover:scale-105 hover:rotate-1 flex-shrink-0 z-10 shadow-2xl hover:shadow-teal-500/20 -ml-3'
                              >
                              
                              <div className='absolute inset-0 bg-gradient-to-br from-teal-500/30 via-cyan-400/30 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700 z-10'></div>
                              
                              {/* Subtle border glow on hover */}
                              <div className='absolute inset-0 rounded-xl border border-transparent group-hover:border-teal-400/50 transition-all duration-700 z-30'></div>
                              
                              <div 
                                className='w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110'
                                style={{
                                  backgroundImage: `url(${movie.poster_path || movie.backdrop_path || `https://source.unsplash.com/random/400x600?${movie.title.toLowerCase().replace(/ /g, '-')}`})`
                                }}
                              ></div>
                              
                              {/* Enhanced movie info overlay */}
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

                {/* Popular Movies Section - Vertical Grid */}
                {!searchQuery && (
                  <div className='w-full px-4 pb-16'>
                    <h2 className='text-white text-2xl font-semibold mb-6 text-center md:text-left md:pl-4'>
                      Popular Movies
                    </h2>
                    
                    {popularLoading ? (
                      <div className='flex justify-center items-center h-64'>
                        <div className='text-white text-lg'>Loading popular movies...</div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 px-4'>
                        {popularMovies.map((movie) => (
                          <Link
                            key={movie.id}
                            to={`/movie/${movie.id}`}
                            className='group relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:z-20'
                          >
                            <div className='absolute inset-0 bg-gradient-to-br from-teal-500/30 via-cyan-400/30 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10'></div>
                            <div 
                              className='w-full h-full bg-cover bg-center'
                              style={{
                                backgroundImage: `url(${movie.poster_path || movie.backdrop_path || `https://source.unsplash.com/random/400x600?${movie.title.toLowerCase().replace(/ /g, '-')}`})`
                              }}
                            ></div>
                            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-20'>
                              <div className='absolute bottom-0 left-0 right-0 p-2'>
                                <div className='bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10'>
                                  <h3 className='text-white text-sm font-bold mb-1 line-clamp-2'>{movie.title}</h3>
                                  <div className='flex items-center gap-1 mb-1'>
                                    <span className='text-yellow-400 text-xs'>★</span>
                                    <span className='text-white text-xs'>{movie.rating}</span>
                                    <span className='text-white/50 text-xs'>• {movie.year}</span>
                                  </div>
                                  <span className='inline-block px-1 py-0.5 bg-white/10 rounded text-xs text-white/90'>
                                    {movie.genre}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          } />
        </Routes>
        )}
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App