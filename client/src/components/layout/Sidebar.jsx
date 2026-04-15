import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiHome,
  HiAcademicCap,
  HiUserGroup,
  HiClipboardList,
  HiDocumentAdd,
  HiCollection,
  HiChartBar,
  HiX,
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = {
    admin: [
      { to: '/admin', label: 'Dashboard', icon: HiHome },
      { to: '/admin/students', label: 'Manage Students', icon: HiAcademicCap },
      { to: '/admin/faculty', label: 'Manage Faculty', icon: HiUserGroup },
      { to: '/admin/internships', label: 'Internships', icon: HiClipboardList },
    ],
    faculty: [
      { to: '/faculty', label: 'Dashboard', icon: HiHome },
      { to: '/faculty/internships', label: 'Review Internships', icon: HiClipboardList },
    ],
    student: [
      { to: '/student', label: 'Dashboard', icon: HiHome },
      { to: '/student/submit', label: 'Submit Internship', icon: HiDocumentAdd },
      { to: '/student/internships', label: 'My Internships', icon: HiCollection },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-surface-100/95 backdrop-blur-xl border-r border-surface-300
          flex flex-col transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiChartBar className="w-6 h-6 text-surface-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-surface-900">IEMS</h1>
              <p className="text-[10px] text-surface-600 uppercase tracking-widest">Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-200 text-surface-600"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 py-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-600 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            {user?.role} Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${user?.role}`}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-surface-900 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
              <p className="text-xs text-surface-700 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
