import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, Search, User, LogOut, Bell, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ sidebarOpen, setSidebarOpen, isAuthenticated, setIsAuthenticated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  // Sync search query with URL params
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  return (
    <nav className="bg-youtube-dark border-b border-youtube-gray sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              console.log('Hamburger clicked, current state:', sidebarOpen);
              setSidebarOpen(!sidebarOpen);
            }}
            className={`p-2 rounded-full transition-colors ${
              sidebarOpen ? 'bg-youtube-gray' : 'hover:bg-youtube-gray'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-youtube-red rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ZuTube</span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setSearchParams({});
                }
              }}
              className="flex-1 bg-youtube-gray border border-gray-600 text-white placeholder-gray-400 rounded-l-lg px-4 py-2 focus:outline-none focus:border-youtube-red"
            />
            <button
              type="submit"
              className="bg-youtube-gray border border-l-0 border-gray-600 text-gray-400 px-4 py-2 rounded-r-lg hover:bg-gray-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button className="p-2 hover:bg-youtube-gray rounded-full transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-youtube-gray rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <span className="text-sm font-medium text-white hidden md:block">
                  {user?.username}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-youtube-gray rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-white hover:text-youtube-red transition-colors font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
