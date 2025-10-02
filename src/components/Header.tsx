import React from 'react';
import { Zap, User, Settings, LogOut, MessageCircle } from 'lucide-react';
import { AuthUser } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  credits: number;
  videoCredits: number;
  onUpgradeClick: () => void;
  user: AuthUser | null;
  onAccountClick: () => void;
  onContactClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  credits, 
  videoCredits,
  onUpgradeClick, 
  user,
  onAccountClick,
  onContactClick,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 xs:h-14 sm:h-16">
          <div className="flex items-center space-x-1.5 xs:space-x-2">
            <img 
              src="/logo.png" 
              alt="NexToImage Logo" 
              className="h-7 xs:h-8 sm:h-10 w-auto object-contain"
            />
            <h1 className="text-lg xs:text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NexToImage
            </h1>
          </div>

          <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 bg-blue-50 rounded-full px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1">
                <Zap className="w-3 xs:w-4 h-3 xs:h-4 text-blue-500" />
                <span className="text-xs xs:text-sm font-medium text-blue-700">
                  {credits}
                </span>
              </div>
              <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 bg-green-50 rounded-full px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1">
                <Zap className="w-3 xs:w-4 h-3 xs:h-4 text-green-500" />
                <span className="text-xs xs:text-sm font-medium text-green-700">
                  {videoCredits} video
                </span>
              </div>
            </div>
            
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg text-xs xs:text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Upgrade
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-7 xs:w-8 h-7 xs:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <User className="w-3 xs:w-4 h-3 xs:h-4 text-white" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 xs:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 xs:px-4 py-2 border-b border-gray-100">
                    <p className="text-xs xs:text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onAccountClick();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 xs:px-4 py-2 text-xs xs:text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Settings className="w-3 xs:w-4 h-3 xs:h-4" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onContactClick();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 xs:px-4 py-2 text-xs xs:text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <MessageCircle className="w-3 xs:w-4 h-3 xs:h-4" />
                    <span>Contact Us</span>
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 xs:px-4 py-2 text-xs xs:text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3 xs:w-4 h-3 xs:h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};