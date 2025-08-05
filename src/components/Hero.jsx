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
          
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
            Unlock the hidden insights in your{' '}
            <span className="text-gradient">
              insurance policies
            </span>
          </h1>
          
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            PolicyAI analyzes your insurance policies in 30 seconds, identifies coverage gaps and risks, 
            and provides personalized recommendations to optimize your protection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button 
              onClick={onGetStarted}
              className="btn btn-primary btn-lg pulse-glow"
            >
              <Brain className="w-5 h-5 mr-2" />
              Analyze Your Policy Now
            </button>
            <button 
              onClick={onViewDashboard}
              className="btn btn-outline btn-lg"
            >
              View Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center fade-in" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl font-bold text-primary-600 mb-2">30s</div>
              <div className="text-secondary-600 font-medium">Analysis Time</div>
            </div>
            <div className="text-center fade-in" style={{ animationDelay: '300ms' }}>
              <div className="text-4xl font-bold text-success-600 mb-2">94%</div>
              <div className="text-secondary-600 font-medium">Coverage Issues Found</div>
            </div>
            <div className="text-center fade-in" style={{ animationDelay: '400ms' }}>
              <div className="text-4xl font-bold text-accent-600 mb-2">$2.3K</div>
              <div className="text-secondary-600 font-medium">Average Savings</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card card-hover text-center p-6 fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="card card-elevated max-w-4xl mx-auto p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Why Choose PolicyAI?
            </h2>
            <p className="text-secondary-600 text-lg">
              Transform how you understand and manage your insurance policies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex-shrink-0 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                </div>
                <span className="text-secondary-700 leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={onGetStarted}
              className="btn btn-primary btn-lg"
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
