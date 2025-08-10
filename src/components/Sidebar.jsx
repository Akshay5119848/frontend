import { Link } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Music, 
  Gamepad2, 
  Film, 
  FileText, 
  Trophy, 
  BookOpen,
  History,
  Clock,
  ThumbsUp,
  PlaySquare
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  console.log('Sidebar render - sidebarOpen:', sidebarOpen);
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/?category=trending' },
    { icon: Music, label: 'Music', path: '/?category=music' },
    { icon: Gamepad2, label: 'Gaming', path: '/?category=gaming' },
    { icon: Film, label: 'Movies', path: '/?category=movies' },
    { icon: FileText, label: 'News', path: '/?category=news' },
    { icon: Trophy, label: 'Sports', path: '/?category=sports' },
    { icon: BookOpen, label: 'Education', path: '/?category=education' },
  ];

  const libraryItems = [
    { icon: History, label: 'History', path: '/history' },
    { icon: Clock, label: 'Watch Later', path: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/liked' },
    { icon: PlaySquare, label: 'Your Videos', path: '/my-videos' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-youtube-dark border-r border-youtube-gray transition-all duration-300 ease-in-out z-50
          lg:translate-x-0
        `}
        style={{
          backgroundColor: '#1f1f1f',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: sidebarOpen ? '2px 0 10px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        <div className="p-4 space-y-6">
          {/* Main Menu */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Menu
            </h3>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-youtube-gray hover:text-white rounded-lg transition-colors group"
                >
                  <item.icon className="w-5 h-5 group-hover:text-youtube-red" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Library */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Library
            </h3>
            <nav className="space-y-1">
              {libraryItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-youtube-gray hover:text-white rounded-lg transition-colors group"
                >
                  <item.icon className="w-5 h-5 group-hover:text-youtube-red" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'JavaScript', 'Python', 'Web Development', 'AI', 'Machine Learning', 'Crypto', 'Gaming'].map((tag) => (
                <Link
                  key={tag}
                  to={`/?tag=${encodeURIComponent(tag)}`}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className="px-3 py-1 bg-youtube-gray text-gray-600 text-xs rounded-full hover:bg-gray-600 hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
