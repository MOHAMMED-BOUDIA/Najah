import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaProjectDiagram, 
  FaTasks, 
  FaUsers, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaBell, 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaTimes 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Define navigation items based on roles
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: FaTachometerAlt, roles: ['student', 'supervisor', 'admin'] },
    { name: 'Projects', path: '/projects', icon: FaProjectDiagram, roles: ['student', 'supervisor', 'admin'] },
    { name: 'Tasks', path: '/tasks', icon: FaTasks, roles: ['student', 'supervisor', 'admin'] },
    { name: 'Teams', path: '/teams', icon: FaUsers, roles: ['student', 'supervisor', 'admin'] },
    { name: 'Documents', path: '/documents', icon: FaFileAlt, roles: ['student', 'supervisor', 'admin'] },
    { name: 'Meetings', path: '/meetings', icon: FaCalendarAlt, roles: ['student', 'supervisor', 'admin'] },
    { name: 'Notifications', path: '/notifications', icon: FaBell, roles: ['student', 'supervisor', 'admin'] },
    { name: 'Profile', path: '/profile', icon: FaUser, roles: ['student', 'supervisor', 'admin'] },
    { name: 'Admin Panel', path: '/admin', icon: FaCog, roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  const activeLinkClass = 'flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition-all dark:bg-indigo-950/40 dark:text-indigo-400';
  const normalLinkClass = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200';

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 md:sticky md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <FaProjectDiagram className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              PFE Hub
            </span>
          </div>
          <button 
            onClick={onClose}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
            aria-label="Close menu"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        {/* User Card (Static in Sidebar) */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-gray-800/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 font-bold">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user?.name}
              </h4>
              <p className="truncate text-xs text-gray-500 capitalize dark:text-gray-400">
                {user?.role}
              </p>
              <p
                className="truncate text-[10px] text-gray-400 dark:text-gray-500"
                title={user?.department || 'N/A'}
              >
                {user?.department || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => (isActive ? activeLinkClass : normalLinkClass)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={handleLogout}
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
