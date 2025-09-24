import React from 'react';
import { User, Settings, LogOut, Zap, Crown, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AccountPageProps {
  imagePlan: string;
  videoPlan: string;
  onUpgradeClick: () => void;
  onPlanChange: (planType: 'image' | 'video', planId: string) => Promise<any>;
  onBackToApp: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  imagePlan,
  videoPlan,
  onUpgradeClick,
  onPlanChange,
  onBackToApp,
}) => {
  const { user, credits, videoCredits, signOut } = useAuth();
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [cancelType, setCancelType] = React.useState<'image' | 'video' | null>(null);
  
  if (!user) return null;

  const getImagePlanInfo = (plan: string) => {
    switch (plan) {
      case 'starter':
        return { name: 'Starter', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case 'pro':
        return { name: 'Pro', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      case 'premium':
        return { name: 'Premium', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      default:
        return { name: 'Free', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const getVideoPlanInfo = (plan: string) => {
    switch (plan) {
      case 'video-starter':
        return { name: 'Video Master Pack', color: 'text-green-600', bgColor: 'bg-green-100' };
      default:
        return { name: 'Free', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const imagePlanInfo = getImagePlanInfo(imagePlan);
  const videoPlanInfo = getVideoPlanInfo(videoPlan);

  const handleCancelPlan = (planType: 'image' | 'video') => {
    setCancelType(planType);
    setShowCancelModal(true);
  };

  const confirmCancelPlan = async () => {
    if (!cancelType) return;
    
    try {
      await onPlanChange(cancelType, 'free');
      setShowCancelModal(false);
      setCancelType(null);
    } catch (error) {
      console.error('Error canceling plan:', error);
      alert('Failed to cancel plan. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBackToApp}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to App
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                <div className="space-y-2">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${imagePlanInfo.bgColor}`}>
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className={`text-sm font-medium ${imagePlanInfo.color}`}>
                      Image: {imagePlanInfo.name}
                    </span>
                  </div>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${videoPlanInfo.bgColor}`}>
                    <Crown className="w-4 h-4 text-green-600" />
                    <span className={`text-sm font-medium ${videoPlanInfo.color}`}>
                      Video: {videoPlanInfo.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credits Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Credit Status</span>
                </h3>
                <button
                  onClick={onUpgradeClick}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Upgrade
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-900 mb-1">{credits}</div>
                  <div className="text-sm text-blue-600">Image Credits</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-900 mb-1">{videoCredits}</div>
                  <div className="text-sm text-green-600">Video Credits</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Free Plan:</strong> You get 2 image credits to start. 
                  Purchase video credits separately for video generation.
                </p>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Crown className="w-5 h-5 text-purple-500" />
                <span>Current Plans</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Image Plan</span>
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${imagePlanInfo.color}`}>{imagePlanInfo.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={onUpgradeClick}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {imagePlan === 'free' ? 'Upgrade' : 'Change'}
                      </button>
                      {imagePlan !== 'free' && (
                        <button
                          onClick={() => handleCancelPlan('image')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Video Plan</span>
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${videoPlanInfo.color}`}>{videoPlanInfo.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={onUpgradeClick}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {videoPlan === 'free' ? 'Choose' : 'Change'}
                      </button>
                      {videoPlan !== 'free' && (
                        <button
                          onClick={() => handleCancelPlan('video')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <span>Account Information</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900 font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="text-gray-900 font-medium">
                    {imagePlanInfo.name} + {videoPlanInfo.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-gray-900 font-medium">
                    {new Date().toLocaleDateString('en-US')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Account ID</span>
                  <span className="text-gray-900 font-mono text-sm">{user.id}</span>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Usage Guidelines
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">General Rules</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Each image generation costs 1 credit</li>
                    <li>Failed generations are refunded</li>
                    <li>Daily maximum of 50 image generations</li>
                    <li>Pro plan required for commercial use</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prohibited Content</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Violence, hate speech, or inappropriate content</li>
                    <li>Copyrighted characters or brands</li>
                    <li>Unauthorized use of personal photos</li>
                    <li>Misleading or fake content generation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Cancel Subscription</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel your {cancelType === 'image' ? 'Image' : 'Video'} plan?
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> You will be able to use your remaining credits until the end of this billing period. 
                  No refund will be provided, but you can continue using the service until your current subscription expires.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancelPlan}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};