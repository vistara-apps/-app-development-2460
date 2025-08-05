import React from 'react';
import { X, Check, Crown, Zap, Star } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const SubscriptionModal = ({ onClose, onSubscribe }) => {
  const { createSession } = usePaymentContext();

  const plans = [
    {
      id: 'personal-pro',
      name: 'Personal Pro',
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals and families',
      icon: Crown,
      color: 'blue',
      features: [
        'Analyze up to 5 policies per month',
        'Advanced AI insights',
        'Renewal reminders',
        'Savings recommendations',
        'Priority email support',
        'Mobile app access'
      ],
      popular: false,
      savings: 'Save vs $9.99 per analysis'
    },
    {
      id: 'business-pro',
      name: 'Business Pro',
      price: '$79',
      period: '/month',
      description: 'Ideal for small businesses and teams',
      icon: Star,
      color: 'purple',
      features: [
        'Analyze up to 20 policies per month',
        'Multi-policy management',
        'Team collaboration (up to 5 users)',
        'Business risk assessment',
        'Compliance tracking',
        'Phone support',
        'Custom reporting'
      ],
      popular: true,
      savings: 'Most popular choice'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$149',
      period: '/month',
      description: 'For insurance agents and brokers',
      icon: Zap,
      color: 'green',
      features: [
        'Analyze up to 100 policies per month',
        'Client management dashboard',
        'White-label reports',
        'Limited API access',
        'Lead generation tools',
        'Priority support',
        'Training resources'
      ],
      popular: false,
      savings: 'Best for professionals'
    }
  ];

  const handleSubscribe = async (planId) => {
    try {
      const result = await createSession(planId, 'monthly');
      if (result.success) {
        onSubscribe(planId);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upgrade Your Insurance Analysis
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock advanced AI insights, unlimited policy analysis, and premium features 
              to optimize your insurance coverage like never before.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;
              
              return (
                <div 
                  key={plan.id}
                  className={`relative border-2 rounded-xl p-6 ${
                    isPopular 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      plan.color === 'purple' 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                        : plan.color === 'green'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="flex items-end justify-center mb-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    
                    {plan.savings && (
                      <div className="text-center mb-4">
                        <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                          {plan.savings}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 pulse-glow'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Why Upgrade?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Lightning Fast</h4>
                <p className="text-sm text-gray-600">30-second analysis powered by advanced AI</p>
              </div>
              <div>
                <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Expert Insights</h4>
                <p className="text-sm text-gray-600">Professional-grade analysis and recommendations</p>
              </div>
              <div>
                <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Save Money</h4>
                <p className="text-sm text-gray-600">Find better coverage and reduce costs</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              🔒 Secure payment processing powered by blockchain technology. 
              Cancel anytime with no long-term commitments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
