import React from 'react';
import { 
  Shield, 
  Brain, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  FileText,
  AlertTriangle,
  Calendar
} from 'lucide-react';

const Hero = ({ onGetStarted, onViewDashboard }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI Policy Analysis',
      description: 'Advanced AI identifies coverage gaps and risks in seconds'
    },
    {
      icon: FileText,
      title: 'Smart Summaries',
      description: 'Complex policies simplified into clear, actionable insights'
    },
    {
      icon: Calendar,
      title: 'Renewal Tracking',
      description: 'Never miss a renewal with automated reminders'
    },
    {
      icon: TrendingUp,
      title: 'Policy Optimization',
      description: 'Get personalized recommendations for better coverage'
    }
  ];

  const benefits = [
    'Analyze unlimited policies in 30 seconds',
    'Identify hidden risks and coverage gaps',
    'Compare policies and find better options',
    'Track renewals and never miss deadlines',
    'Get expert-level insights without the cost'
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            <span>AI-Powered Insurance Analysis</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Unlock the hidden insights in your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              insurance policies
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            PolicyAI analyzes your insurance policies in 30 seconds, identifies coverage gaps and risks, 
            and provides personalized recommendations to optimize your protection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button 
              onClick={onGetStarted}
              className="btn btn-primary text-lg px-8 py-3 pulse-glow"
            >
              <Brain className="w-5 h-5 mr-2" />
              Analyze Your Policy Now
            </button>
            <button 
              onClick={onViewDashboard}
              className="btn btn-secondary text-lg px-8 py-3"
            >
              View Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">30s</div>
              <div className="text-gray-600">Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
              <div className="text-gray-600">Coverage Issues Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$2.3K</div>
              <div className="text-gray-600">Average Savings</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card text-center hover:shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="card max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PolicyAI?
            </h2>
            <p className="text-gray-600">
              Transform how you understand and manage your insurance policies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={onGetStarted}
              className="btn btn-primary text-lg px-8 py-3"
            >
              Get Started - It's Free
            </button>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Hero;