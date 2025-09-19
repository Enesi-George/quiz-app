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
    navigate('/auth');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Quiz App</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-4">
              <Link
                to="/questions"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/questions'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Questions
              </Link>
              <Link
                to="/quiz"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/quiz'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Take Quiz
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">
                Welcome, {user?.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
