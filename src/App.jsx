import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import VideoPage from './pages/VideoPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-youtube-dark">
          <Navbar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
          <div className="flex">
            <Sidebar 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen}
            />
            <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
              <Routes>
                <Route path="/" element={<Home sidebarOpen={sidebarOpen} />} />
                <Route path="/video/:id" element={<VideoPage />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
