// TMDB API configuration
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

// Debug logging
console.log('TMDB API KEY loaded:', import.meta.env.VITE_TMDB_API_KEY ? 'Yes' : 'No');

// Get streaming providers for a movie
export const getStreamingProviders = async (movieId) => {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      throw new Error('TMDB API key not found');
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Focus on US market, but you can change this to other regions
    const usProviders = data.results?.US;
    
    return {
      streaming: usProviders?.flatrate || [], // Netflix, Hulu, etc.
      rent: usProviders?.rent || [], // Amazon Prime Video rent, Apple TV, etc.
      buy: usProviders?.buy || [], // Purchase options
      free: usProviders?.free || [], // Free with ads
      link: usProviders?.link || '' // TMDB link to all providers
    };
  } catch (error) {
    console.error('Error fetching streaming providers:', error);
    return {
      streaming: [],
      rent: [],
      buy: [],
      free: [],
      link: ''
    };
  }
};


// Get trending movies using TMDB API directly
export const getTrendingMovies = async (timeWindow = 'day') => {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      console.error('❌ TMDB API key not found in environment variables');
      throw new Error('TMDB API key not found');
    }

    console.log('🔄 Fetching trending movies from TMDB API...');
    const url = `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${apiKey}`;
    console.log('📡 API URL:', url.replace(apiKey, 'HIDDEN_API_KEY'));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('❌ TMDB API request failed:', response.status, response.statusText);
      throw new Error(`TMDB API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Successfully fetched trending movies:', data.results?.length || 0, 'movies');
    
    // Genre mapping for TMDB genre IDs
    const genreMap = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
    };

    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title || movie.original_title,
      rating: movie.vote_average?.toFixed(1) || 'N/A',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
      genre: movie.genre_ids?.[0] ? genreMap[movie.genre_ids[0]] || 'Drama' : 'Drama',
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
      overview: movie.overview || 'No overview available',
      release_date: movie.release_date
    }));
  } catch (error) {
    console.error('❌ Error fetching trending movies:', error.message);
    console.error('🔄 Using fallback movies instead');
    // Return fallback movies if TMDB API fails
    return getFallbackMovies();
  }
};

// Enhanced fallback movie data with more movies
export const getFallbackMovies = () => {
  return [
    {
      id: 533535,
      title: 'Deadpool & Wolverine',
      rating: '7.8',
      year: '2024',
      genre: 'Action',
      poster_path: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba4jL2so6HZdBx.jpg',
      overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him.',
      release_date: '2024-07-24'
    },
    {
      id: 1022789,
      title: 'Inside Out 2',
      rating: '7.6',
      year: '2024',
      genre: 'Animation',
      poster_path: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg',
      overview: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!',
      release_date: '2024-06-11'
    },
    {
      id: 945961,
      title: 'Alien: Romulus',
      rating: '7.3',
      year: '2024',
      genre: 'Horror',
      poster_path: 'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg',
      overview: 'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.',
      release_date: '2024-08-13'
    },
    {
      id: 1184918,
      title: 'The Wild Robot',
      rating: '8.5',
      year: '2024',
      genre: 'Animation',
      poster_path: 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/417tYZ4XUyJrtyZXj7HpvWf1E8f.jpg',
      overview: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island.',
      release_date: '2024-09-12'
    },
    {
      id: 748783,
      title: 'Transformers One',
      rating: '8.1',
      year: '2024',
      genre: 'Animation',
      poster_path: 'https://image.tmdb.org/t/p/w500/iGGydV6OxMdLbmhIpOJ0jZhbGgE.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/Asg2UUwipAdE87MxtJy7SQo08XI.jpg',
      overview: 'The untold origin story of Optimus Prime and Megatron, better known as sworn enemies, but once were friends bonded like brothers.',
      release_date: '2024-09-11'
    },
    {
      id: 519182,
      title: 'Despicable Me 4',
      rating: '7.1',
      year: '2024',
      genre: 'Animation',
      poster_path: 'https://image.tmdb.org/t/p/w500/wWba3TaojhK7NdycRhoQpsG0FaH.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/lgkPzcOSnTvjeMnuFzozRO5HHw1.jpg',
      overview: 'Gru and Lucy and their girls welcome a new baby boy. But when Maxime Le Mal escapes from prison, Gru must face his most dangerous nemesis yet.',
      release_date: '2024-06-20'
    },
    {
      id: 1051891,
      title: 'Beetlejuice Beetlejuice',
      rating: '7.2',
      year: '2024',
      genre: 'Comedy',
      poster_path: 'https://image.tmdb.org/t/p/w500/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/xi1VSt3DtkevUmzCx2mNlCoDe74.jpg',
      overview: 'After a family tragedy, three generations of the Deetz family return home to Winter River.',
      release_date: '2024-09-04'
    },
    {
      id: 558449,
      title: 'Gladiator II',
      rating: '6.8',
      year: '2024',
      genre: 'Action',
      poster_path: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg',
      overview: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum.',
      release_date: '2024-11-13'
    }
  ];
};

// Legacy function for backward compatibility (commented out - unused)
// const getFallbackMovie = (imdbId, index) => {
//   const movies = getFallbackMovies();
//   return movies[index] || movies[0];
// };

// Search movies using TMDB API directly
export const searchMovies = async (query, page = 1) => {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      throw new Error('TMDB API key not found');
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Genre mapping for TMDB genre IDs
    const genreMap = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
    };

    const results = data.results.map(movie => ({
      id: movie.id,
      title: movie.title || movie.original_title,
      rating: movie.vote_average?.toFixed(1) || 'N/A',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
      genre: movie.genre_ids?.[0] ? genreMap[movie.genre_ids[0]] || 'Drama' : 'Drama',
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
      overview: movie.overview || 'No overview available',
      release_date: movie.release_date
    }));
    
    return {
      results,
      total_pages: data.total_pages,
      page: data.page
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    // Fallback to filtering trending movies
    const allMovies = getFallbackMovies();
    const filteredMovies = allMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      results: filteredMovies,
      total_pages: 1,
      page: 1
    };
  }
};

// Get popular movies using TMDB API directly
export const getPopularMovies = async (page = 1) => {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      console.error('❌ TMDB API key not found for popular movies');
      throw new Error('TMDB API key not found');
    }

    console.log('🔄 Fetching popular movies from TMDB API...');
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
    console.log('📡 Popular API URL:', url.replace(apiKey, 'HIDDEN_API_KEY'));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Genre mapping for TMDB genre IDs
    const genreMap = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
    };

    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title || movie.original_title,
      rating: movie.vote_average?.toFixed(1) || 'N/A',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
      genre: movie.genre_ids?.[0] ? genreMap[movie.genre_ids[0]] || 'Drama' : 'Drama',
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
      overview: movie.overview || 'No overview available',
      release_date: movie.release_date
    }));
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    // Return different fallback movies for popular section
    return getFallbackMovies().slice(3, 9); // Different subset for variety
  }
};

// Get movie genres (OMDb doesn't have a genres endpoint, return common genres)
export const getGenres = async () => {
  return [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adventure' },
    { id: 3, name: 'Animation' },
    { id: 4, name: 'Comedy' },
    { id: 5, name: 'Crime' },
    { id: 6, name: 'Documentary' },
    { id: 7, name: 'Drama' },
    { id: 8, name: 'Family' },
    { id: 9, name: 'Fantasy' },
    { id: 10, name: 'History' },
    { id: 11, name: 'Horror' },
    { id: 12, name: 'Music' },
    { id: 13, name: 'Mystery' },
    { id: 14, name: 'Romance' },
    { id: 15, name: 'Science Fiction' },
    { id: 16, name: 'Thriller' },
    { id: 17, name: 'War' },
    { id: 18, name: 'Western' }
  ];
};

// Get movie details using TMDB API directly
export const getMovieDetails = async (movieId) => {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      throw new Error('TMDB API key not found');
    }

    const [movieResponse, creditsResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`)
    ]);
    
    if (!movieResponse.ok || !creditsResponse.ok) {
      throw new Error(`TMDB API error: ${movieResponse.status}`);
    }
    
    const [movieData, creditsData] = await Promise.all([
      movieResponse.json(),
      creditsResponse.json()
    ]);
    
    return {
      id: movieData.id,
      title: movieData.title || movieData.original_title,
      overview: movieData.overview || 'No overview available',
      release_date: movieData.release_date,
      runtime: movieData.runtime || 'N/A',
      vote_average: movieData.vote_average || 0,
      vote_count: movieData.vote_count || 0,
      genres: movieData.genres || [],
      poster_path: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null,
      backdrop_path: movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null,
      production_companies: movieData.production_companies || [],
      cast: creditsData.cast?.slice(0, 10) || [],
      crew: creditsData.crew?.filter(person => person.job === 'Director') || [],
      ratings: {
        imdb: movieData.vote_average?.toFixed(1) || 'N/A',
        metacritic: 'N/A',
        rotten_tomatoes: 'N/A',
        letterboxd: 'N/A'
      }
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    // Return fallback details for the requested movie
    const fallbackMovies = getFallbackMovies();
    const movie = fallbackMovies.find(m => m.id == movieId) || fallbackMovies[0];
    
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      runtime: '120',
      vote_average: parseFloat(movie.rating) || 7.0,
      vote_count: 1000,
      genres: [{ id: 1, name: movie.genre }],
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      production_companies: [{ name: 'Production Company', logo_path: null }],
      cast: [
        { name: 'Actor 1', character: 'Character 1', profile_path: null },
        { name: 'Actor 2', character: 'Character 2', profile_path: null }
      ],
      crew: [{ name: 'Director Name', job: 'Director' }],
      ratings: {
        imdb: movie.rating,
        metacritic: 'N/A',
        rotten_tomatoes: 'N/A',
        letterboxd: 'N/A'
      }
    };
  }
};

// Helper function to get poster URL
export const getPosterUrl = (posterPath) => {
  return posterPath; // TMDB returns full URLs
};

// Helper function to get backdrop URL
export const getBackdropUrl = (backdropPath) => {
  return backdropPath; // TMDB returns full URLs
};

// Test TMDB API functionality
export const testAPIKey = async () => {
  try {
    console.log('Testing TMDB API...');
    
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    
    console.log('TMDB API Key present:', apiKey ? 'Yes' : 'No');
    
    if (!apiKey) {
      throw new Error('Missing TMDB API key in .env file');
    }
    
    // Test with trending movies endpoint
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('TMDB API test successful:', data);
    return { success: true, data: data };
  } catch (error) {
    console.error('TMDB API test failed:', error);
    return { success: false, error: error.message };
  }
};
