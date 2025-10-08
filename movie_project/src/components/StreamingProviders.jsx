// Streaming providers component for detailed movie pages
import React, { useState, useEffect } from 'react'
import { getStreamingProviders } from '../services/tmdbApi'

const StreamingProviders = ({ movieId }) => {
  const [providers, setProviders] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      if (movieId) {
        setLoading(true)
        const providerData = await getStreamingProviders(movieId)
        setProviders(providerData)
        setLoading(false)
      }
    }

    fetchProviders()
  }, [movieId])

  if (loading) {
    return (
      <div className="bg-white/5 rounded-lg p-6 border border-teal-400/20">
        <h3 className="text-xl font-bold text-white mb-4">Where to Watch</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-600 rounded"></div>
        </div>
      </div>
    )
  }

  if (!providers) return null

  const hasAnyProviders = providers.streaming?.length > 0 || providers.rent?.length > 0 || providers.buy?.length > 0 || providers.free?.length > 0

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-teal-400/20 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📺 Where to Watch
      </h3>

      {hasAnyProviders ? (
        <div className="space-y-4">
          {/* Streaming Services */}
          {providers.streaming?.length > 0 && (
            <div>
              <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-1">
                ✅ Stream Now
              </h4>
              <div className="flex flex-wrap gap-2">
                {providers.streaming.map((provider, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-lg px-3 py-2"
                  >
                    {provider.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-6 h-6 rounded"
                      />
                    )}
                    <span className="text-green-300 text-sm font-medium">
                      {provider.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rental Services */}
          {providers.rent?.length > 0 && (
            <div>
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-1">
                💰 Rent or Buy
              </h4>
              <div className="flex flex-wrap gap-2">
                {providers.rent.map((provider, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-2"
                  >
                    {provider.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-6 h-6 rounded"
                      />
                    )}
                    <span className="text-blue-300 text-sm font-medium">
                      {provider.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Free with Ads */}
          {providers.free?.length > 0 && (
            <div>
              <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-1">
                🆓 Free with Ads
              </h4>
              <div className="flex flex-wrap gap-2">
                {providers.free.map((provider, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-2"
                  >
                    {provider.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-6 h-6 rounded"
                      />
                    )}
                    <span className="text-yellow-300 text-sm font-medium">
                      {provider.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link to more providers */}
          {providers.link && (
            <div className="pt-2 border-t border-gray-600">
              <a
                href={providers.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1 transition-colors"
              >
                🔗 View all streaming options →
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🎬</div>
          <p className="text-gray-400 mb-2">Not currently available for streaming</p>
          <p className="text-sm text-gray-500">Check local theaters or come back later</p>
        </div>
      )}
    </div>
  )
}

export default StreamingProviders
