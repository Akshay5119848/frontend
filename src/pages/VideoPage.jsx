import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/VideoCard';
import Comments from '../components/Comments';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  Flag, 
  User, 
  Loader2
} from 'lucide-react';

const VideoPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  
  // Use ref to prevent multiple simultaneous requests
  const isRequesting = useRef(false);

  const fetchVideo = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isRequesting.current) return;
    
    try {
      isRequesting.current = true;
      setLoading(true);
      console.log('Fetching video with ID:', id);
      
      const response = await api.get(`/videos/${id}`);
      console.log('Video fetched successfully:', response.data);
      setVideo(response.data);
    } catch (err) {
      console.error('Error fetching video:', err);
      console.error('Error details:', err.response?.data);
      setError('Video not found');
    } finally {
      setLoading(false);
      isRequesting.current = false;
    }
  }, [id]);

  const fetchRelatedVideos = useCallback(async () => {
    try {
      const response = await api.get('/videos');
      // Filter out current video and get first 10 related videos
      const filtered = response.data.filter(v => v.id !== id).slice(0, 10);
      setRelatedVideos(filtered);
    } catch (err) {
      console.error('Error fetching related videos:', err);
    }
  }, [id]);

  useEffect(() => {
    console.log('VideoPage useEffect triggered with ID:', id);
    
    // Reset state when video ID changes
    setVideo(null);
    setRelatedVideos([]);
    setLoading(true);
    setError(null);
    
    // Fetch new video data
    fetchVideo();
    fetchRelatedVideos();
  }, [id]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      setLiked(false);
    }
  };

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-youtube-red mx-auto mb-4" />
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Video not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Video Player */}
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            controls
            className="w-full aspect-video"
            poster={video.thumbnailUrl}
            src={video.videoUrl}
            onError={(e) => {
              console.error('Video error:', e);
              e.target.style.display = 'none';
              const errorDiv = document.createElement('div');
              errorDiv.className = 'w-full aspect-video bg-gray-800 flex items-center justify-center';
              errorDiv.innerHTML = '<p class="text-white">Video not available</p>';
              e.target.parentNode.appendChild(errorDiv);
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">{video.title}</h1>
          
          {/* Stats and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{video.uploadTime}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  liked ? 'bg-blue-600 text-white' : 'bg-youtube-gray text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{video.likes || 0}</span>
              </button>
              
              <button
                onClick={handleDislike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  disliked ? 'bg-blue-600 text-white' : 'bg-youtube-gray text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>{video.dislikes || 0}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-youtube-gray text-gray-300 rounded-full hover:bg-gray-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-youtube-gray text-gray-300 rounded-full hover:bg-gray-600 transition-colors">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-youtube-gray text-gray-300 rounded-full hover:bg-gray-600 transition-colors">
                <Flag className="w-5 h-5" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channel Info */}
        <div className="bg-youtube-gray rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {video.channelLogo ? (
                <img
                  src={video.channelLogo}
                  alt={video.channelName}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-white">{video.channelName}</h3>
                <p className="text-sm text-gray-400">{video.subscriber} subscribers</p>
              </div>
              
              {video.isVerified && (
                <span className="text-blue-400 text-sm">✓ Verified</span>
              )}
            </div>
            
            <button 
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                subscribed 
                  ? 'bg-gray-600 text-gray-300' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-youtube-gray rounded-lg p-4">
          <h3 className="font-medium text-white mb-2">Description</h3>
          <p className="text-gray-300 text-sm whitespace-pre-wrap">
            {video.description || 'No description available.'}
          </p>
          
          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-youtube-dark text-gray-300 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments */}
        <Comments videoId={id} />
      </div>

      {/* Sidebar - Related Videos */}
      <div className="lg:w-80 space-y-4">
        <h3 className="text-lg font-medium text-white">You might also like</h3>
        <div className="space-y-4">
          {relatedVideos.map((relatedVideo) => (
            <VideoCard key={relatedVideo.id} video={relatedVideo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
