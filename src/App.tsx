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
  const { user, loading, credits, videoCredits, imagePlan, videoPlan, updatePlan, updateCredits, updateVideoCredits } = useAuth();
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
    // For now, simulate successful purchase and update the plan
    console.log('Selected plan:', plan);
    
    // Update the plan in the database
    if (plan.planType === 'image') {
      updatePlan('image', plan.id).then(() => {
        alert(`Successfully upgraded to ${plan.name} plan! Credits will be added to your account.`);
        setShowUpgradeModal(false);
      }).catch((error) => {
        console.error('Error updating plan:', error);
        alert('Failed to update plan. Please try again.');
      });
    } else if (plan.planType === 'video') {
      updatePlan('video', plan.id).then(() => {
        alert(`Successfully upgraded to ${plan.name} plan! Video credits will be added to your account.`);
        setShowUpgradeModal(false);
      }).catch((error) => {
        console.error('Error updating plan:', error);
        alert('Failed to update plan. Please try again.');
      });
    }
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
        imagePlan={imagePlan}
        videoPlan={videoPlan}
        onUpgradeClick={() => {
          setShowAccountPage(false);
          setShowUpgradeModal(true);
        }}
        onPlanChange={updatePlan}
        onBackToApp={() => setShowAccountPage(false)}
      />
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        credits={credits} 
        videoCredits={videoCredits}
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
            updateCredits={updateCredits}
            userPlan={imagePlan}
          />
        ) : activeTab === 'image-to-image' ? (
          <ImageToImage 
            credits={credits} 
            updateCredits={updateCredits}
            userPlan={imagePlan}
          />
        ) : (
          <ImageToVideo 
           videoCredits={videoCredits} 
           updateVideoCredits={updateVideoCredits}
          />
        )}
      </main>

      <UpgradeModal
        isOpen={showUpgradeModal}
        currentImagePlan={imagePlan}
        currentVideoPlan={videoPlan}
        onClose={() => setShowUpgradeModal(false)}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
}

export default App;