import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, Brain, BarChart3, User, Home, Menu, X } from 'lucide-react';

const Header = ({ user, onNavigate, currentView, subscriptionStatus }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'upload', label: 'Analyze Policy', icon: Brain },
  ];

  const handleNavigation = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-secondary-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavigation('hero')}
            >
              <div className="p-2 bg-gradient-accent rounded-xl group-hover:scale-105 transition-transform duration-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient">
                  PolicyAI
                </h1>
                <p className="text-xs text-secondary-500">AI-Powered Insurance</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`btn btn-ghost btn-md ${
                      isActive 
                        ? 'bg-primary-100 text-primary-700 font-semibold' 
                        : 'text-secondary-600 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Subscription Status */}
              <div className={`status-badge ${
                subscriptionStatus === 'pro' ? 'status-success' :
                subscriptionStatus === 'premium' ? 'bg-accent-100 text-accent-800' :
                'status-neutral'
              }`}>
                {subscriptionStatus === 'free' ? 'Free Plan' : 
                 subscriptionStatus === 'pro' ? 'Pro Plan' : 'Premium Plan'}
              </div>

              {/* Wallet Connection */}
              <div className="scale-90">
                <ConnectButton />
              </div>

              {/* User Avatar */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gradient-accent rounded-full flex items-center justify-center ring-2 ring-primary-100">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-secondary-700">{user.name}</p>
                    <p className="text-xs text-secondary-500">{user.company}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Subscription Status */}
              <div className={`status-badge text-xs ${
                subscriptionStatus === 'pro' ? 'status-success' :
                subscriptionStatus === 'premium' ? 'bg-accent-100 text-accent-800' :
                'status-neutral'
              }`}>
                {subscriptionStatus === 'free' ? 'Free' : 
                 subscriptionStatus === 'pro' ? 'Pro' : 'Premium'}
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn btn-ghost btn-sm p-2"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-secondary-200 shadow-large animate-slide-down">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-100 text-primary-700 font-semibold' 
                          : 'text-secondary-600 hover:bg-secondary-50 hover:text-primary-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-base">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile User Info */}
              {user && (
                <div className="pt-4 border-t border-secondary-200">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary-700">{user.name}</p>
                      <p className="text-xs text-secondary-500">{user.company}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-secondary-200">
                <div className="px-4">
                  <ConnectButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
