import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, Calendar, Building2 } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isRestaurantOwner, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">ReserveTable</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/restaurants" className="text-gray-700 hover:text-primary-600 transition-colors">
              Restaurants
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-reservations" className="text-gray-700 hover:text-primary-600 transition-colors">
                  My Reservations
                </Link>
                
                {isRestaurantOwner && (
                  <Link to="/restaurant-dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Dashboard
                  </Link>
                )}
                
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Admin
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="h-5 w-5" />
                    <span>{user?.name}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/restaurants" 
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Restaurants
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/my-reservations" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Reservations
                  </Link>
                  
                  {isRestaurantOwner && (
                    <Link 
                      to="/restaurant-dashboard" 
                      className="text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
