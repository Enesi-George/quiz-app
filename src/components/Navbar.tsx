import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-toastify';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/quiz');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Quiz App</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Navigation items - now always visible */}
            <div className="flex space-x-2 sm:space-x-4">
              <Link
                to="/quiz"
                className={`px-2 sm:px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/quiz'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Take Quiz
              </Link>
              {isAuthenticated && (
                <Link
                  to="/questions"
                  className={`px-2 sm:px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/questions'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="hidden sm:inline">Manage Questions</span>
                  <span className="sm:hidden">Questions</span>
                </Link>
              )}
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700 hidden sm:inline">
                    Welcome, {user?.full_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};