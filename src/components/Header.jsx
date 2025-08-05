import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, Brain, BarChart3, User, Home } from 'lucide-react';

const Header = ({ user, onNavigate, currentView, subscriptionStatus }) => {
  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'upload', label: 'Analyze Policy', icon: Brain },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('hero')}
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PolicyAI
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Insurance</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Subscription Status */}
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                subscriptionStatus === 'pro' ? 'bg-green-100 text-green-800' :
                subscriptionStatus === 'premium' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {subscriptionStatus === 'free' ? 'Free Plan' : 
                 subscriptionStatus === 'pro' ? 'Pro Plan' : 'Premium Plan'}
              </div>
            </div>

            {/* Wallet Connection */}
            <ConnectButton />

            {/* User Avatar */}
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.company}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;