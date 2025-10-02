import React from 'react';
import { Zap, User, Settings, LogOut, MessageCircle, Menu, X } from 'lucide-react';
import { AuthUser } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  credits: number;
  videoCredits: number;
  onUpgradeClick: () => void;
  user: AuthUser | null;
  onAccountClick: () => void;
  onContactClick: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  credits, 
  videoCredits,
  onUpgradeClick, 
  user,
  onAccountClick,
  onContactClick,
  onLogoClick,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const { signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <button 
            onClick={onLogoClick}
            className="flex items-center space-x-2 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/logo.png" 
              alt="NexToImage Logo" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NexToImage
            </h1>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Credits Display */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-3 py-1">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">{credits}</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 rounded-full px-3 py-1">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">{videoCredits} video</span>
              </div>
            </div>
            
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Upgrade
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <User className="w-4 h-4 text-white" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onAccountClick();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onContactClick();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Us</span>
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile Credits - Compact */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-1 bg-blue-50 rounded-full px-2 py-1">
                <Zap className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-blue-700">{credits}</span>
              </div>
              <div className="flex items-center space-x-1 bg-green-50 rounded-full px-2 py-1">
                <Zap className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium text-green-700">{videoCredits}</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              {showMobileMenu ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Menu className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-3 bg-white">
            <div className="space-y-2">
              <button
                onClick={onUpgradeClick}
                className="block px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => {
                  onAccountClick();
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                Account Settings
              </button>
              <button
                onClick={() => {
                  onContactClick();
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                Contact Us
              </button>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};