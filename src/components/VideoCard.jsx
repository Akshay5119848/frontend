import { Link } from 'react-router-dom';
import { Clock, Eye, User } from 'lucide-react';

const VideoCard = ({ video }) => {
  return (
    <Link 
      to={`/video/${video.id}`}
      className="group block bg-youtube-gray rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-200 hover:scale-105"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-800 overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback for failed images */}
        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm hidden">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p>No Thumbnail</p>
          </div>
        </div>
        
        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        )}
        
        
      </div>

      {/* Video Info */}
      <div className="p-3">
        <div className="flex space-x-3">
          {/* Channel Avatar */}
          <div className="flex-shrink-0">
            {video.channelLogo ? (
              <img
                src={video.channelLogo}
                alt={video.channelName}
                className="w-9 h-9 rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Fallback for failed channel logos */}
            <div className={`w-9 h-9 bg-youtube-gray rounded-full flex items-center justify-center ${video.channelLogo ? 'hidden' : ''}`}>
              <User className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-youtube-red transition-colors">
              {video.title}
            </h3>
            
            <div className="mt-1 space-y-1">
              <p className="text-xs text-gray-400 hover:text-white transition-colors">
                {video.channelName}
                {video.isVerified && (
                  <span className="ml-1 text-blue-400">✓</span>
                )}
              </p>
              
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{video.uploadTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-youtube-dark text-gray-300 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default VideoCard;
