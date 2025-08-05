import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Header from './components/Header';
import Hero from './components/Hero';
import PolicyUpload from './components/PolicyUpload';
import PolicyAnalysis from './components/PolicyAnalysis';
import Dashboard from './components/Dashboard';
import SubscriptionModal from './components/SubscriptionModal';
import { usePaymentContext } from './hooks/usePaymentContext';

function App() {
  const [currentView, setCurrentView] = useState('hero');
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Mock user login for demo
  useEffect(() => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      industry: 'Technology'
    };
    setUser(mockUser);
  }, []);

  const handlePolicyUpload = (policyData) => {
    const newPolicy = {
      id: Date.now().toString(),
      ...policyData,
      uploadDate: new Date().toISOString(),
      status: 'analyzing'
    };
    
    setPolicies(prev => [...prev, newPolicy]);
    setCurrentPolicy(newPolicy);
    setCurrentView('analysis');
  };

  const handleAnalysisComplete = (analysisResults) => {
    const updatedPolicy = {
      ...currentPolicy,
      ...analysisResults,
      status: 'completed'
    };
    
    setPolicies(prev => 
      prev.map(p => p.id === currentPolicy.id ? updatedPolicy : p)
    );
    setCurrentPolicy(updatedPolicy);
  };

  const handleSubscribe = async (plan) => {
    try {
      // In a real app, this would integrate with Stripe
      setSubscriptionStatus(plan);
      setShowSubscriptionModal(false);
      // Allow access to premium features
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'hero':
        return (
          <Hero 
            onGetStarted={() => setCurrentView('upload')}
            onViewDashboard={() => setCurrentView('dashboard')}
          />
        );
      case 'upload':
        return (
          <PolicyUpload 
            onUpload={handlePolicyUpload}
            subscriptionStatus={subscriptionStatus}
            onUpgradeRequired={() => setShowSubscriptionModal(true)}
          />
        );
      case 'analysis':
        return (
          <PolicyAnalysis 
            policy={currentPolicy}
            onComplete={handleAnalysisComplete}
            onBack={() => setCurrentView('upload')}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            policies={policies}
            onNewAnalysis={() => setCurrentView('upload')}
            onViewPolicy={(policy) => {
              setCurrentPolicy(policy);
              setCurrentView('analysis');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header 
        user={user}
        onNavigate={setCurrentView}
        currentView={currentView}
        subscriptionStatus={subscriptionStatus}
      />
      
      <main className="pt-16">
        {renderCurrentView()}
      </main>

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
}

export default App;
