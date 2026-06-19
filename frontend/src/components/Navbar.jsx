import React, { useState } from 'react';
import { FaUserAlt, FaCog, FaHistory, FaSignOutAlt, FaSearch, FaBell } from 'react-icons/fa'; // Premium standard icons jode hain

const Navbar = ({ userName = "Admin User", userRole = "Super Admin" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState(''); // Search query ke liye state

  // 🚪 1. LOGOUT ACTION LOGIC
  const handleLogout = () => {
    sessionStorage.removeItem('authToken'); // Session token clear kiya
    window.location.href = '/login'; // Redirect to fresh login route
  };

  // 🔍 2. SEARCH REDIRECTION HANDLER (Name ke according filter redirect)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      // User ko direct students page par query string ke sath bhej dega
      window.location.href = `/students?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50 transition-all duration-300">
      
      {/* Left Side: Modern Brand Logo */}
      <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
        <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 transform group-hover:scale-105 transition duration-300">
          <span className="text-white text-xl font-bold">S</span>
        </div>
        <div>
          <h2 className="font-extrabold text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent hidden sm:block tracking-wide">
            School<span className="text-indigo-600">Sync</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase hidden sm:block -mt-1">
            Management Portal
          </p>
        </div>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center space-x-5">
        
        {/* 🔍 Premium Search Input: Typing filter */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <input 
            type="text" 
            placeholder="Search student by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit} // Enter marne par dynamic redirection
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition duration-200 text-slate-700 font-medium"
          />
          <span className="absolute left-3 top-2 text-slate-400 text-xs">
            <FaSearch />
          </span>
        </div>

        {/* Notification Bell Icon */}
        <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition duration-200">
          <FaBell className="text-lg" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Divider Line */}
        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* User Profile Action */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1.5 hover:bg-slate-50 rounded-full sm:rounded-xl transition duration-200 focus:outline-none"
          >
            {/* Elegant Avatar with Online Status */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold rounded-xl flex items-center justify-center shadow-sm">
                {userName.charAt(0)}
              </div>
              <span className="absolute bottom-[-2px] right-[-2px] w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            {/* Name & Role */}
            <div className="text-left hidden sm:block pr-2">
              <p className="text-xs font-bold text-slate-800">{userName}</p>
              <p className="text-[11px] font-medium text-indigo-600/80">{userRole}</p>
            </div>
            
            {/* Down Arrow */}
            <span className={`text-[10px] text-slate-400 transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Premium Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 py-2 z-50 transform origin-top-right transition duration-200 scale-100">
              <div className="px-4 py-2.5 border-b border-slate-50 sm:hidden">
                <p className="text-sm font-bold text-slate-800">{userName}</p>
                <p className="text-xs text-indigo-600 font-medium">{userRole}</p>
              </div>
              
              <a href="#profile" className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 transition font-medium">
                <FaUserAlt className="text-xs text-slate-400" /> <span>My Profile</span>
              </a>
              <a href="#settings" className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 transition font-medium">
                <FaCog className="text-xs text-slate-400" /> <span>Account Settings</span>
              </a>
              <a href="#activity" className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 transition font-medium">
                <FaHistory className="text-xs text-slate-400" /> <span>Activity Log</span>
              </a>
              
              <hr className="my-1.5 border-slate-100" />
              
              {/* 🚨 LOGOUT ACTION REGISTERED */}
              <button 
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-bold transition"
              >
                <FaSignOutAlt className="text-xs" /> <span>Logout System</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;