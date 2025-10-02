import React from 'react';
import { Camera, Image, Video, ArrowLeft } from 'lucide-react';
import { TabType } from '../types';

interface ModelSelectorProps {
  onSelectModel: (model: TabType) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelectModel }) => {
  const models = [
    {
      id: 'text-to-image' as TabType,
      title: 'Text to Image',
      description: 'Transform your words into stunning visuals with advanced AI technology',
      icon: Camera,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      features: ['High-quality images', 'Multiple resolutions', 'Fast generation']
    },
    {
      id: 'image-to-image' as TabType,
      title: 'Image to Image',
      description: 'Reimagine and transform your existing images with AI-powered creativity',
      icon: Image,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      features: ['Style transfer', 'Image enhancement', 'Creative transformations']
    },
    {
      id: 'image-to-video' as TabType,
      title: 'Image to Video',
      description: 'Bring your images to life with stunning AI-generated video animations',
      icon: Video,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      features: ['Smooth animations', 'Professional quality', 'Up to 20s videos']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Welcome to NexToImage
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect AI model for your creative needs
          </p>
        </div>

        {/* Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <div
                key={model.id}
                className="group cursor-pointer"
                onClick={() => onSelectModel(model.id)}
              >
                <div className={`bg-gradient-to-br ${model.bgGradient} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${model.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {model.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {model.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {model.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button className={`w-full py-3 px-6 bg-gradient-to-r ${model.gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform group-hover:scale-105`}>
                    Select Model
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Professional AI-Powered Creation
            </h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Our advanced AI models are designed to deliver professional-quality results for creators, 
              businesses, and artists. Each model is optimized for specific use cases to ensure the best possible output.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Fast Generation</h3>
                <p className="text-sm text-gray-600">Results in seconds</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">High Quality</h3>
                <p className="text-sm text-gray-600">Professional results</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600">Your content is safe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};