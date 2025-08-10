import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/axios';
import VideoCard from '../components/VideoCard';
import { Search, Filter, Loader2 } from 'lucide-react';



const Home = ({ sidebarOpen }) => {
  const [allVideos, setAllVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Use ref to prevent multiple simultaneous requests
  const isRequesting = useRef(false);
  const isInitialMount = useRef(true);

  const categories = [
    'All', 'Trending', 'Music', 'Gaming', 'Movies', 'News', 'Sports', 'Education'
  ];

  const fetchVideos = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isRequesting.current) return;
    
    try {
      isRequesting.current = true;
      setLoading(true);
      setError(null);
      
      const response = await api.get('/videos');
      console.log('Videos fetched:', response.data);
      console.log('First video structure:', response.data[0]);
      setAllVideos(response.data);
    } catch (err) {
      setError('Failed to fetch videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
      isRequesting.current = false;
    }
  }, []);

  // Filter videos based on search params
  const filterVideos = useCallback(() => {
    const query = searchParams.get('search')?.toLowerCase();
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    
    let filtered = allVideos;
    
    // Filter by search query (title)
    if (query) {
      filtered = filtered.filter(video => 
        video.title?.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        video.channelName?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (category && category !== 'All') {
      filtered = filtered.filter(video => 
        video.category?.toLowerCase() === category.toLowerCase() ||
        video.tags?.some(tag => tag.toLowerCase() === category.toLowerCase())
      );
    }
    
    // Filter by tag
    if (tag) {
      filtered = filtered.filter(video => 
        video.tags?.some(videoTag => 
          videoTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }
    
    setFilteredVideos(filtered);
  }, [allVideos, searchParams]);

  // Handle search params changes and filter videos
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
    
    // Filter videos when params change
    filterVideos();
    
    // Mark initial mount as complete
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [searchParams, filterVideos]);

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);





  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleTagClick = (tag) => {
    setSearchParams({ tag });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-youtube-red mx-auto mb-4" />
          <p className="text-gray-400">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchVideos()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-8 space-y-4">

        {/* Categories */}
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category || (!selectedCategory && category === 'All')
                    ? 'bg-youtube-red text-white'
                    : 'bg-youtube-gray text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Info */}
        {(searchParams.get('search') || selectedCategory) && (
          <div className="text-gray-400">
            {searchParams.get('search') && <span>Search results for: "{searchParams.get('search')}"</span>}
            {searchParams.get('search') && selectedCategory && <span> • </span>}
            {selectedCategory && selectedCategory !== 'All' && <span>Category: {selectedCategory}</span>}
            <span> • {filteredVideos.length} videos found</span>
          </div>
        )}
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className={`grid gap-6 ${
          sidebarOpen 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
        }`}>
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No videos found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
