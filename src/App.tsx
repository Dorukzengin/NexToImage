import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { AccountPage } from './components/AccountPage';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { TextToImage } from './components/TextToImage';
import { ImageToImage } from './components/ImageToImage';
import { UpgradeModal } from './components/UpgradeModal';
import { TabType, PricingPlan, User, AuthState } from './types';

function App() {
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAccountPage, setShowAccountPage] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('text-to-image');
  const [credits, setCredits] = useState(2); // Start with 2 free credits
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAuth = (email: string, password: string, name?: string) => {
    // Simulate authentication
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || email.split('@')[0],
      credits: 2, // Start with 2 credits
      plan: 'free',
      createdAt: new Date(),
    };
    
    setCurrentUser(user);
    setCredits(user.credits);
    setAuthState('authenticated');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCredits(2);
    setAuthState('landing');
    setShowAccountPage(false);
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    // In a real app, this would process payment
    setCredits(credits + plan.credits);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        credits: credits + plan.credits,
        plan: plan.id as 'starter' | 'pro',
      });
    }
    setShowUpgradeModal(false);
    
    // Show success message (in a real app, you'd show a proper toast/notification)
    alert(`Successfully upgraded to ${plan.name}! ${plan.credits} credits added to your account.`);
  };

  // Landing page
  if (authState === 'landing') {
    return (
      <>
        <LandingPage onGetStarted={() => setAuthState('login')} />
        <AuthModal
          isOpen={authState === 'login' || authState === 'register'}
          mode={authMode}
          onClose={() => setAuthState('landing')}
          onAuth={handleAuth}
          onSwitchMode={() => {
            setAuthMode(authMode === 'login' ? 'register' : 'login');
            setAuthState(authMode === 'login' ? 'register' : 'login');
          }}
        />
      </>
    );
  }

  // Account page
  if (showAccountPage && currentUser) {
    return (
      <AccountPage
        user={currentUser}
        onUpgradeClick={() => {
          setShowAccountPage(false);
          setShowUpgradeModal(true);
        }}
        onLogout={handleLogout}
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
        user={currentUser}
        onAccountClick={() => setShowAccountPage(true)}
        onLogout={handleLogout}
      />
      
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <main className="py-8">
        {activeTab === 'text-to-image' ? (
          <TextToImage 
            credits={credits} 
            onCreditsChange={setCredits} 
          />
        ) : (
          <ImageToImage 
            credits={credits} 
            onCreditsChange={setCredits} 
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