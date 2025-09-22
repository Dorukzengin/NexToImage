import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { AccountPage } from './components/AccountPage';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { TextToImage } from './components/TextToImage';
import { ImageToImage } from './components/ImageToImage';
import { ImageToVideo } from './components/ImageToVideo';
import { UpgradeModal } from './components/UpgradeModal';
import { TabType, PricingPlan } from './types';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading, credits, updateCredits } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountPage, setShowAccountPage] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('text-to-image');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user) {
      setShowLanding(false);
      setShowAuthModal(false);
    }
  }, [user]);

  const handleSelectPlan = (plan: PricingPlan) => {
    // In a real app, this would process payment
    updateCredits(plan.credits);
    setShowUpgradeModal(false);
    
    // Show success message (in a real app, you'd show a proper toast/notification)
    alert(`Successfully upgraded to ${plan.name}! ${plan.credits} credits added to your account.`);
  };

  const handleCreditsChange = async (newCredits: number) => {
    const creditChange = newCredits - credits;
    await updateCredits(creditChange);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Landing page
  if (showLanding || !user) {
    return (
      <>
        <LandingPage onGetStarted={() => {
          setShowLanding(false);
          setShowAuthModal(true);
          setAuthMode('register');
        }} />
        <AuthModal
          isOpen={showAuthModal}
          mode={authMode}
          onClose={() => {
            setShowAuthModal(false);
            setShowLanding(true);
          }}
          onSwitchMode={() => {
            setAuthMode(authMode === 'login' ? 'register' : 'login');
          }}
          onSuccess={() => {
            setShowAuthModal(false);
            setShowLanding(false);
          }}
        />
      </>
    );
  }

  // Account page
  if (showAccountPage) {
    return (
      <AccountPage
        onUpgradeClick={() => {
          setShowAccountPage(false);
          setShowUpgradeModal(true);
        }}
        onBackToApp={() => setShowAccountPage(false)}
      />
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        credits={credits} 
        onUpgradeClick={() => setShowUpgradeModal(true)}
        user={user}
        onAccountClick={() => setShowAccountPage(true)}
      />
      
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <main className="py-8">
        {activeTab === 'text-to-image' ? (
          <TextToImage 
            credits={credits} 
            onCreditsChange={handleCreditsChange} 
          />
        ) : activeTab === 'image-to-image' ? (
          <ImageToImage 
            credits={credits} 
            onCreditsChange={handleCreditsChange} 
          />
        ) : (
          <ImageToVideo 
            credits={credits} 
            onCreditsChange={handleCreditsChange} 
          />
        )}
      </main>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
}

export default App;