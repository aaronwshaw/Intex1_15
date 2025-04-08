import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../api/IntexAPI';
import { UserContext } from './AuthorizeView';
import { Home, Search, Film, User, LogOut, Menu, X } from 'lucide-react';

const NavItem = ({ label, icon, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 ${
      isActive
        ? 'bg-red-500 text-white'
        : 'text-gray-200 hover:bg-gray-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-lg">{label}</span>
  </div>
);

const SidebarNav = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.ok) {
        navigate('/login');
      } else {
        alert('Logout failed: ' + result.error);
      }
    } catch (error) {
      alert('Logout error: ' + error.message);
    }
  };

  const isActive = (path) => {
    if (path === '/home?foryou=true') {
      return (
        location.pathname === '/home' && location.search.includes('foryou=true')
      );
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-black text-white md:hidden"
      >
        {collapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white flex flex-col shadow-lg z-40 transition-all duration-300 ${
          collapsed ? 'w-0 -translate-x-full' : 'w-64'
        } md:translate-x-0 md:w-64`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* App Title with gradient */}
          <h1 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            CineNiche
          </h1>

          {/* User profile */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Welcome,</p>
              <p className="text-sm font-medium truncate max-w-40">
                {user.email}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <NavItem
              label="Search"
              icon={<Search size={20} />}
              onClick={() => navigate('/search')}
              isActive={isActive('/search')}
            />
            <NavItem
              label="All Movies"
              icon={<Film size={20} />}
              onClick={() => navigate('/home')}
              isActive={
                isActive('/home') && !location.search.includes('foryou=true')
              }
            />
            <NavItem
              label="For You"
              icon={<Home size={20} />}
              onClick={() => navigate('/home?foryou=true')}
              isActive={isActive('/home?foryou=true')}
            />
          </nav>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Logout */}
          <div className="pt-4 border-t border-gray-700">
            <NavItem
              label="Logout"
              icon={<LogOut size={20} />}
              onClick={handleLogout}
              isActive={false}
            />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
};

export default SidebarNav;
