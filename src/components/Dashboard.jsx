import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download
} from 'lucide-react';

const Dashboard = ({ user, policies, onNewAnalysis, onViewPolicy }) => {
  const [filter, setFilter] = useState('all');

  // Calculate dashboard stats
  const stats = {
    totalPolicies: policies.length,
    activeAlerts: policies.filter(p => p.status === 'needs_attention').length,
    upcomingRenewals: policies.filter(p => {
      if (!p.renewalDate) return false;
      const renewalDate = new Date(p.renewalDate);
      const today = new Date();
      const diffTime = renewalDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length,
    averageRating: policies.length > 0 ? 'B+' : 'N/A'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'analyzing': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'needs_attention': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredPolicies = policies.filter(policy => {
    if (filter === 'all') return true;
    if (filter === 'active') return policy.status === 'completed';
    if (filter === 'alerts') return policy.status === 'needs_attention';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">
            Monitor your insurance policies and stay protected with AI insights
          </p>
        </div>
        <button 
          onClick={onNewAnalysis}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Analyze New Policy
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalPolicies}</div>
          <div className="text-sm text-gray-600">Total Policies</div>
        </div>
        <div className="card text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.activeAlerts}</div>
          <div className="text-sm text-gray-600">Active Alerts</div>
        </div>
        <div className="card text-center">
          <Calendar className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.upcomingRenewals}</div>
          <div className="text-sm text-gray-600">Renewals (30 days)</div>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.averageRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 max-w-md">
          {[
            { id: 'all', label: 'All Policies' },
            { id: 'active', label: 'Active' },
            { id: 'alerts', label: 'Need Attention' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Policies List */}
      {filteredPolicies.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {policies.length === 0 ? 'No Policies Yet' : 'No Policies Match Filter'}
          </h3>
          <p className="text-gray-600 mb-6">
            {policies.length === 0 
              ? 'Upload your first insurance policy to get started with AI-powered analysis.'
              : 'Try adjusting your filter to see more policies.'
            }
          </p>
          <button 
            onClick={onNewAnalysis}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Analyze Your First Policy
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map((policy) => (
            <div key={policy.id} className="card hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {policy.insuranceProvider}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {policy.coverageType} Insurance
                  </p>
                </div>
                {getStatusIcon(policy.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Policy #:</span>
                  <span className="text-gray-900">{policy.policyNumber}</span>
                </div>
                {policy.limits && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Limits:</span>
                    <span className="text-gray-900">{policy.limits}</span>
                  </div>
                )}
                {policy.renewalDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Renewal:</span>
                    <span className="text-gray-900">
                      {new Date(policy.renewalDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Analysis Results Preview */}
              {policy.summary && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Rating:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {policy.summary.overallRating}
                    </span>
                  </div>
                  {policy.summary.recommendations > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-yellow-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{policy.summary.recommendations} recommendations</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                <button 
                  onClick={() => onViewPolicy(policy)}
                  className="btn btn-primary flex-1 text-sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <button className="btn btn-secondary">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={onNewAnalysis}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
          >
            <Plus className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Upload New Policy</h3>
            <p className="text-sm text-gray-600">Get AI analysis in 30 seconds</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left">
            <Calendar className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Set Renewal Reminders</h3>
            <p className="text-sm text-gray-600">Never miss a renewal deadline</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left">
            <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Compare Policies</h3>
            <p className="text-sm text-gray-600">Find better coverage options</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;