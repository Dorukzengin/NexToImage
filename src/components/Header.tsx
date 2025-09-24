import React from 'react';
import { Zap, User, Settings, LogOut } from 'lucide-react';
import { AuthUser } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  credits: number;
  videoCredits: number;
  onUpgradeClick: () => void;
  user: AuthUser | null;
  onAccountClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  credits, 
  videoCredits,
  onUpgradeClick, 
  user,
  onAccountClick,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo-transparent.png" 
              alt="NexToImage Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NexToImage
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-3 py-1">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  {credits}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 rounded-full px-3 py-1">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  {videoCredits} video
                </span>
              </div>
            </div>
            
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Upgrade
            </button>
            
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
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
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
        </div>
      </div>
    </header>
  );
};