import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Vault</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/transactions" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Transactions
            </Link>
            <Link 
              to="/budget" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Budget
            </Link>
            <Link 
              to="/subscriptions" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Subscriptions
            </Link>
            <Link 
              to="/portfolio" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Portfolio
            </Link>
          </div>

          {/* Right side - Mobile Menu Button and User Menu */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden md:block font-medium">{user?.name || 'User'}</span>
                <svg 
                  className={`hidden md:block w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium rounded-md"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link 
                to="/transactions" 
                className="px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium rounded-md"
                onClick={closeMobileMenu}
              >
                Transactions
              </Link>
              <Link 
                to="/budget" 
                className="px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium rounded-md"
                onClick={closeMobileMenu}
              >
                Budget
              </Link>
              <Link 
                to="/subscriptions" 
                className="px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium rounded-md"
                onClick={closeMobileMenu}
              >
                Subscriptions
              </Link>
              <Link 
                to="/portfolio" 
                className="px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium rounded-md"
                onClick={closeMobileMenu}
              >
                Portfolio
              </Link>
              <Link 
                to="/settings" 
                className="px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium rounded-md"
                onClick={closeMobileMenu}
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
