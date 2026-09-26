import React, { useState } from 'react';
import { useApp, ActivePage } from '../context/AppContext';
import {
  Dumbbell,
  Home,
  Info,
  Users,
  BookOpen,
  Mail,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    user,
    isLoggedIn,
    setIsLoggedIn,
    setIsLoginModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ab7a52] text-white shadow-sm font-sans border-b border-[#9c6e48]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo on Left */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 cursor-pointer select-none"
          >
            <Dumbbell className="w-5 h-5 text-orange-200" />
            <span className="font-bold text-lg sm:text-xl tracking-tight text-white font-['Outfit',sans-serif]">
              FitTrack Pro
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                activePage === 'home'
                  ? 'bg-[#cf784d] text-white shadow-xs'
                  : 'text-amber-50/90 hover:text-white hover:bg-black/10'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                activePage === 'about'
                  ? 'bg-[#cf784d] text-white shadow-xs'
                  : 'text-amber-50/90 hover:text-white hover:bg-black/10'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About Us</span>
            </button>

            <button
              onClick={() => handleNavClick('workouts')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                activePage === 'workouts'
                  ? 'bg-[#cf784d] text-white shadow-xs font-semibold'
                  : 'text-amber-50/90 hover:text-white hover:bg-black/10'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Workouts</span>
            </button>

            <button
              onClick={() => handleNavClick('community')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                activePage === 'community'
                  ? 'bg-[#cf784d] text-white shadow-xs'
                  : 'text-amber-50/90 hover:text-white hover:bg-black/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Community</span>
            </button>

            <button
              onClick={() => handleNavClick('dietary-refs')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                activePage === 'dietary-refs'
                  ? 'bg-[#cf784d] text-white shadow-xs'
                  : 'text-amber-50/90 hover:text-white hover:bg-black/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Dietary Refs</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                activePage === 'contact'
                  ? 'bg-[#cf784d] text-white shadow-xs'
                  : 'text-amber-50/90 hover:text-white hover:bg-black/10'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </button>

            {/* Login / Profile Item */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                    activePage === 'profile' || activePage === 'statements'
                      ? 'bg-[#cf784d] text-white'
                      : 'text-amber-50/90 hover:text-white hover:bg-black/10'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[85px]">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-amber-200" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 text-stone-800 border border-stone-200 z-50 animate-in fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <button
                      onClick={() => {
                        handleNavClick('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-amber-50 flex items-center space-x-2 text-stone-700"
                    >
                      <User className="w-3.5 h-3.5 text-amber-700" />
                      <span>Profile & Badges</span>
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('statements');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-amber-50 flex items-center space-x-2 text-stone-700"
                    >
                      <span>Activity Log</span>
                    </button>
                    <div className="border-t border-stone-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-amber-50/90 hover:text-white hover:bg-black/10 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-amber-100 hover:text-white hover:bg-black/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#996b45] border-t border-[#875c39] px-4 py-3 space-y-1 text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-white hover:bg-black/10"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-white hover:bg-black/10"
          >
            <Info className="w-4 h-4" />
            <span>About Us</span>
          </button>
          <button
            onClick={() => handleNavClick('workouts')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left bg-[#cf784d] text-white font-semibold"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Workouts</span>
          </button>
          <button
            onClick={() => handleNavClick('community')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-white hover:bg-black/10"
          >
            <Users className="w-4 h-4" />
            <span>Community</span>
          </button>
          <button
            onClick={() => handleNavClick('dietary-refs')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-white hover:bg-black/10"
          >
            <BookOpen className="w-4 h-4" />
            <span>Dietary Refs</span>
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-white hover:bg-black/10"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </button>
          <div className="pt-2 border-t border-amber-900/40">
            {isLoggedIn ? (
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center justify-between px-3 py-2 text-left text-amber-100"
              >
                <span>Profile ({user.name})</span>
                <span className="text-xs text-rose-200" onClick={() => setIsLoggedIn(false)}>
                  Logout
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left text-white"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
