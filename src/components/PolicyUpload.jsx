import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Crown,
  ArrowRight
} from 'lucide-react';

const PolicyUpload = ({ onUpload, subscriptionStatus, onUpgradeRequired }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [policyDetails, setPolicyDetails] = useState({
    policyNumber: '',
    coverageType: 'auto',
    insuranceProvider: '',
    limits: '',
    deductible: '',
    renewalDate: ''
  });

  // Check if user has reached upload limits
  const canUpload = subscriptionStatus !== 'free' || true; // For demo, allow uploads

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!canUpload) {
      onUpgradeRequired();
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (!canUpload) {
      onUpgradeRequired();
      return;
    }

    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      alert('Please upload a policy document first');
      return;
    }

    const policyData = {
      ...policyDetails,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.type
    };

    onUpload(policyData);
  };

  const coverageTypes = [
    { value: 'auto', label: 'Auto Insurance' },
    { value: 'home', label: 'Home Insurance' },
    { value: 'life', label: 'Life Insurance' },
    { value: 'health', label: 'Health Insurance' },
    { value: 'business', label: 'Business Insurance' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10 fade-in">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Upload Your Insurance Policy
        </h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
          Upload your policy document and provide some basic details. 
          Our AI will analyze it in 30 seconds to identify risks, gaps, and optimization opportunities.
        </p>
      </div>

      {!canUpload && (
        <div className="card card-bordered mb-8 border-l-4 border-warning-400 bg-warning-50 p-6 slide-up">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-warning-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-warning-800 mb-2">Upgrade Required</h3>
              <p className="text-warning-700 mb-4 leading-relaxed">
                You've reached the upload limit for free accounts. Upgrade to continue analyzing policies and unlock advanced features.
              </p>
              <button 
                onClick={onUpgradeRequired}
                className="btn btn-warning btn-md"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload Section */}
        <div className="card card-hover p-6 slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">1</span>
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Upload Policy Document
            </h2>
          </div>
          
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-primary-400 bg-primary-50 scale-105' 
                : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50/50'
            } ${!canUpload ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={!canUpload}
            />
            
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-secondary-600 font-medium">Processing your policy...</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center scale-in">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-success-600" />
                </div>
                <p className="text-success-700 font-semibold text-lg mb-1">{uploadedFile.name}</p>
                <p className="text-secondary-500 text-sm">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-secondary-400" />
                </div>
                <p className="text-secondary-700 mb-2 font-medium text-lg">
                  Drag and drop your policy document here, or click to browse
                </p>
                <p className="text-sm text-secondary-500">
                  Supports PDF, DOC, DOCX, TXT files up to 10MB
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-start space-x-3 text-sm text-secondary-600 bg-secondary-50 rounded-lg p-4">
            <div className="flex-shrink-0 w-5 h-5 bg-secondary-200 rounded-full flex items-center justify-center mt-0.5">
              <AlertCircle className="w-3 h-3 text-secondary-500" />
            </div>
            <p className="leading-relaxed">
              Your documents are processed securely and not stored permanently. 
              We only extract necessary information for analysis.
            </p>
          </div>
        </div>

        {/* Policy Details Form */}
        <div className="card card-hover p-6 slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">2</span>
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Policy Details
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label">
                Policy Number
              </label>
              <input
                type="text"
                value={policyDetails.policyNumber}
                onChange={(e) => setPolicyDetails({...policyDetails, policyNumber: e.target.value})}
                className="form-input"
                placeholder="POL123456789"
              />
              <p className="form-help">Enter your policy number as shown on your documents</p>
            </div>

            <div>
              <label className="form-label">
                Coverage Type
              </label>
              <select
                value={policyDetails.coverageType}
                onChange={(e) => setPolicyDetails({...policyDetails, coverageType: e.target.value})}
                className="form-input"
              >
                {coverageTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="form-help">Select the type of insurance coverage</p>
            </div>

            <div>
              <label className="form-label">
                Insurance Provider
              </label>
              <input
                type="text"
                value={policyDetails.insuranceProvider}
                onChange={(e) => setPolicyDetails({...policyDetails, insuranceProvider: e.target.value})}
                className="form-input"
                placeholder="e.g., State Farm, Allstate, Progressive"
              />
              <p className="form-help">Name of your insurance company</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Coverage Limits
                </label>
                <input
                  type="text"
                  value={policyDetails.limits}
                  onChange={(e) => setPolicyDetails({...policyDetails, limits: e.target.value})}
                  className="form-input"
                  placeholder="$100,000"
                />
                <p className="form-help">Maximum coverage amount</p>
              </div>

              <div>
                <label className="form-label">
                  Deductible
                </label>
                <input
                  type="text"
                  value={policyDetails.deductible}
                  onChange={(e) => setPolicyDetails({...policyDetails, deductible: e.target.value})}
                  className="form-input"
                  placeholder="$1,000"
                />
                <p className="form-help">Amount you pay before coverage kicks in</p>
              </div>
            </div>

            <div>
              <label className="form-label">
                Renewal Date
              </label>
              <input
                type="date"
                value={policyDetails.renewalDate}
                onChange={(e) => setPolicyDetails({...policyDetails, renewalDate: e.target.value})}
                className="form-input"
              />
              <p className="form-help">When your policy expires and needs renewal</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!uploadedFile || uploading}
                className="btn btn-primary btn-lg w-full"
              >
                <FileText className="w-5 h-5 mr-2" />
                Analyze Policy
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PolicyUpload;
