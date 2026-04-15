import { useAuth } from '../../context/AuthContext';
import { HiMenuAlt2, HiLogout, HiBell } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-100/80 backdrop-blur-xl border-b border-surface-300">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-surface-600 hover:text-surface-900 transition-colors"
          >
            <HiMenuAlt2 className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-surface-900">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h2>
            <p className="text-xs text-surface-700">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl hover:bg-white/10 text-surface-600 hover:text-surface-900 transition-colors relative">
            <HiBell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-500/10 text-surface-700
                       hover:text-red-400 transition-all duration-200 text-sm font-medium"
          >
            <HiLogout className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
