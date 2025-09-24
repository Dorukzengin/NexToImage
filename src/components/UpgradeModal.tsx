import React from 'react';
import { X, Zap, Check } from 'lucide-react';
import { PricingPlan } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  currentImagePlan: string;
  currentVideoPlan: string;
  onClose: () => void;
  onSelectPlan: (plan: PricingPlan) => void;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 20,
    credits: 50,
    features: [
      '50 image generations',
      'All resolution options',
      'Text-to-image generation',
      'Image-to-image transformation',
      'Download in high quality',
    ],
    planType: 'image',
    level: 1,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 35,
    credits: 100,
    features: [
      '100 image generations',
      'All resolution options',
      'Text-to-image generation',
      'Image-to-image transformation',
      'Download in high quality',
      'Priority processing',
    ],
    planType: 'image',
    level: 2,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 50,
    credits: 150,
    features: [
      '150 image generations',
      'All resolution options',
      'Text-to-image generation',
      'Image-to-image transformation',
      'Download in high quality',
      'Priority processing',
      'Best choice for heavy creators',
    ],
    planType: 'image',
    level: 3,
  },
  {
    id: 'video-starter',
    name: 'Video Starter',
    price: 40,
    credits: 0,
    videoCredits: 5,
    features: [
      '5 AI-generated videos (up to 20s each)',
      'Kling Video AI – Master quality',
      'Stunning visuals for professional use',
      'Download in high quality',
      'Perfect for beginners',
    ],
    planType: 'video',
    level: 1,
  },
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  currentImagePlan,
  currentVideoPlan,
  onClose,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  const getActionText = (plan: PricingPlan) => {
    if (plan.planType === 'image') {
      if (currentImagePlan === 'free') return 'Upgrade to';
      const currentPlan = pricingPlans.find(p => p.id === currentImagePlan && p.planType === 'image');
      if (!currentPlan) return 'Choose';
      if (plan.level > currentPlan.level) return 'Upgrade to';
      if (plan.level < currentPlan.level) return 'Downgrade to';
      return 'Current Plan';
    } else {
      if (currentVideoPlan === 'free') return 'Choose';
      return currentVideoPlan === plan.id ? 'Current Plan' : 'Switch to';
    }
  };

  const isCurrentPlan = (plan: PricingPlan) => {
    return (plan.planType === 'image' && currentImagePlan === plan.id) ||
           (plan.planType === 'video' && currentVideoPlan === plan.id);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
              <p className="text-gray-600 mt-1">Choose the perfect plan for your creative needs</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Image Generation Plans</h3>
              <p className="text-gray-600">Perfect for creating stunning AI images</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pricingPlans.filter(plan => plan.planType === 'image').map((plan) => (
              <div
                key={plan.id}
                className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${
                  plan.id === 'premium'
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-center mb-6">
                  {plan.id === 'premium' && (
                    <div className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      <Zap className="w-4 h-4 mr-1" />
                      Best for Creators
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mt-1">{plan.credits} credits included</p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectPlan(plan)}
                  disabled={isCurrentPlan(plan)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    isCurrentPlan(plan)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : plan.id === 'premium'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  {getActionText(plan)} {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Generation Plan</h3>
              <p className="text-gray-600">Transform your images into stunning videos</p>
            </div>
          </div>

          <div className="max-w-md mx-auto mb-8">
            {pricingPlans.map((plan) => (
              plan.planType === 'video' && (
              <div
                key={plan.id}
                className="border-2 border-green-300 bg-green-50 rounded-xl p-6 transition-all duration-200 hover:shadow-lg"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <Zap className="w-4 h-4 mr-1" />
                    Video Generation
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mt-1">{plan.videoCredits} video credits included</p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectPlan(plan)}
                  disabled={isCurrentPlan(plan)}
                  className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700"
                >
                  {getActionText(plan)} {plan.name}
                </button>
              </div>
              )
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-medium">Note:</span> Payment processing will be handled through Lemon Squeezy.
              You can upgrade or downgrade your plans anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};