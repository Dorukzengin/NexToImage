import React from 'react';
import { Zap, Camera, Brush, Play, Check, ArrowRight, Star, Users, Shield, Clock } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Camera,
      title: 'Text-to-Image Generation',
      description: 'Transform your words into stunning visuals with advanced AI technology.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Brush,
      title: 'Image-to-Image Transformation',
      description: 'Reimagine and transform your existing images with AI-powered creativity.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Play,
      title: 'AI-Powered Video Creation',
      description: 'Bring your images to life with stunning AI-generated video animations.',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 20,
      credits: 50,
      features: [
        'Text-to-image generation',
        'Image-to-image transformation',
        'All resolution options',
        'Standard processing',
        'Download in high quality'
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Pro',
      price: 35,
      credits: 100,
      features: [
        'Text-to-image generation',
        'Image-to-image transformation',
        'All resolution options',
        'Priority processing',
        'Download in high quality',
        'Email support'
      ],
      popular: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Premium',
      price: 50,
      credits: 150,
      features: [
        'Text-to-image generation',
        'Image-to-image transformation',
        'All resolution options',
        'Priority processing',
        'HD downloads',
        'Premium support'
      ],
      popular: false,
      color: 'from-pink-500 to-pink-600'
    },
    {
      name: 'Video Package',
      price: 40,
      credits: 5,
      videoPackage: true,
      features: [
        '5 AI video generations',
        'Kling Master model',
        'Up to 20s per video',
        'High-quality output',
        'Professional results',
        'Priority processing'
      ],
      popular: false,
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Enter Your Text or Upload Image',
      description: 'Describe what you want to create or upload an existing image to transform.',
      icon: '✍️'
    },
    {
      number: 2,
      title: 'AI Generates Your Output',
      description: 'Our advanced AI processes your request and creates stunning visuals.',
      icon: '🤖'
    },
    {
      number: 3,
      title: 'Download in High Quality',
      description: 'Get your professional-quality images and videos ready to use.',
      icon: '⬇️'
    }
  ];

  const faqs = [
    {
      question: 'What are credits?',
      answer: 'Credits are used to generate images and videos. Each image generation costs 1 credit, and each video generation costs 1 video credit.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your credits will remain valid until used or until the end of your billing period.'
    },
    {
      question: 'How do I get started?',
      answer: 'Simply click "Start Creating Now" to sign up for a free account. You\'ll get 2 free image credits to try our platform immediately.'
    },
    {
      question: 'Do I get free credits?',
      answer: 'Yes! Every new account receives 2 free image credits instantly upon sign-up. No credit card required to start.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/logo-transparent.png" 
                  alt="NexToImage Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NexToImage
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
            </nav>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-700">AI-Powered Creativity Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Turn Your Ideas Into
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Stunning AI Images & Videos
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI-powered creativity at your fingertips. Generate professional-quality images and videos 
                from simple text descriptions or transform existing images with cutting-edge AI technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Start Creating Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">🎁</span>
                </div>
                <span className="text-green-800 font-medium">
                  Sign up and get 2 free image credits instantly!
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4 shadow-2xl">
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Prompt:</p>
                    <p className="text-sm text-gray-800 font-medium">"A serene mountain lake at sunset with purple sky"</p>
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src="/NexToImage AI Image Generation (1).png" 
                      alt="AI-Generated mountain lake at sunset with purple sky"
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Generated in 3 seconds</span>
                    </div>
                    <span>1024×1024 HD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unleash your creativity with our comprehensive suite of AI-powered tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible pricing for creators of all levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                  plan.popular ? 'border-purple-300 scale-105' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {plan.videoPackage ? `${plan.credits} video generations` : `${plan.credits} credits included`}
                  </p>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={onGetStarted}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-gradient-to-r ${plan.color} text-white hover:shadow-lg`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Create professional content in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎁</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Try Before You Subscribe!</h3>
                <p className="text-gray-600">Every new account starts with 2 free credits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about NexToImage
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Amazing Content?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators and start generating stunning AI images and videos today.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-12 py-4 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-3"
          >
            <span>Start Creating Now</span>
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-blue-100 mt-4">
            No credit card required • 2 free credits included
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/logo-transparent.png" 
                    alt="NexToImage Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold">NexToImage</h3>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                Transform your ideas into stunning AI-generated images and videos. 
                Professional quality results with cutting-edge AI technology.
              </p>
              <div className="flex items-center space-x-4 text-gray-400">
                <Users className="w-5 h-5" />
                <span>Trusted by 50,000+ creators</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NexToImage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};