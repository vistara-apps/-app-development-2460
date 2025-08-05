import React, { useState } from 'react';
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Building, 
  Users, 
  ArrowRight,
  Calculator,
  Shield,
  Briefcase
} from 'lucide-react';

const PricingPage = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const subscriptionPlans = [
    {
      id: 'personal-pro',
      name: 'Personal Pro',
      price: billingCycle === 'monthly' ? 29 : 290,
      originalPrice: billingCycle === 'monthly' ? null : 348,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Perfect for individuals and families',
      icon: Crown,
      color: 'blue',
      features: [
        '5 policy analyses per month',
        'Advanced AI insights',
        'Renewal reminders',
        'Savings recommendations',
        'Priority email support',
        'Mobile app access'
      ],
      popular: false,
      target: 'Individual'
    },
    {
      id: 'business-pro',
      name: 'Business Pro',
      price: billingCycle === 'monthly' ? 79 : 790,
      originalPrice: billingCycle === 'monthly' ? null : 948,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Ideal for small businesses and teams',
      icon: Star,
      color: 'purple',
      features: [
        '20 policy analyses per month',
        'Multi-policy management',
        'Team collaboration (up to 5 users)',
        'Business risk assessment',
        'Compliance tracking',
        'Phone support',
        'Custom reporting'
      ],
      popular: true,
      target: 'Small Business'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 149 : 1490,
      originalPrice: billingCycle === 'monthly' ? null : 1788,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'For insurance agents and brokers',
      icon: Briefcase,
      color: 'green',
      features: [
        '100 policy analyses per month',
        'Client management dashboard',
        'White-label reports',
        'Limited API access',
        'Lead generation tools',
        'Priority support',
        'Training resources'
      ],
      popular: false,
      target: 'Professional'
    }
  ];

  const usageBasedOptions = [
    {
      id: 'pay-per-analysis',
      name: 'Pay Per Analysis',
      price: 9.99,
      description: 'Perfect for occasional users',
      icon: Calculator,
      features: [
        'No monthly commitment',
        'Full analysis features',
        '30-day result access',
        'Email support'
      ]
    },
    {
      id: 'volume-10',
      name: '10 Analysis Pack',
      price: 79,
      pricePerAnalysis: 7.90,
      description: 'Great for trying out the service',
      icon: Shield,
      features: [
        'Valid for 6 months',
        'Full analysis features',
        'Priority email support',
        '20% savings vs pay-per-use'
      ]
    },
    {
      id: 'volume-25',
      name: '25 Analysis Pack',
      price: 179,
      pricePerAnalysis: 7.16,
      description: 'Popular choice for small businesses',
      icon: Building,
      features: [
        'Valid for 12 months',
        'Full analysis features',
        'Priority support',
        '28% savings vs pay-per-use'
      ],
      popular: true
    }
  ];

  const enterpriseFeatures = [
    'Unlimited policy analyses',
    'Advanced API access',
    'Custom integrations',
    'Dedicated account manager',
    'SLA guarantees',
    'Custom branding',
    'Advanced analytics',
    'Compliance certifications',
    'White-label options',
    'Custom feature development'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From individuals to enterprises, we have a pricing plan that fits your needs. 
            Start with our free tier or choose a plan that scales with your business.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Free Tier Highlight */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Start Free Today</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get started with 1 free policy analysis per month. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              1 policy analysis per month
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Basic risk assessment
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Coverage gap identification
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Subscription Plans
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;
              
              return (
                <div 
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                    isPopular 
                      ? 'border-purple-500 transform scale-105' 
                      : 'border-gray-200'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      plan.color === 'purple' 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                        : plan.color === 'green'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2">{plan.target}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-end justify-center mb-2">
                        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600 ml-1">{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="text-center">
                          <span className="text-sm text-gray-500 line-through">${plan.originalPrice}/year</span>
                          <span className="text-sm text-green-600 font-medium ml-2">Save 17%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Usage-Based Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Pay As You Go
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Perfect for occasional users or those who want to try our service without commitment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usageBasedOptions.map((option) => {
              const Icon = option.icon;
              
              return (
                <div 
                  key={option.id}
                  className={`bg-white rounded-xl shadow-md border p-6 ${
                    option.popular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  {option.popular && (
                    <div className="text-center mb-4">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{option.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${option.price}</span>
                      {option.pricePerAnalysis && (
                        <div className="text-sm text-gray-500 mt-1">
                          ${option.pricePerAnalysis} per analysis
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectPlan(option.id)}
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Enterprise Solutions</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Custom solutions for large organizations, insurance companies, and enterprises 
              with specific requirements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 text-left">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 mr-3" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onSelectPlan('enterprise')}
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Sales
              </button>
              <button
                onClick={() => onSelectPlan('demo')}
                className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Schedule Demo
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, all paid plans come with a 14-day free trial. No credit card required for the free tier.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards and cryptocurrency payments through our secure blockchain integration.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all subscription plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

