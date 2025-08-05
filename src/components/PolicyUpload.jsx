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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Insurance Policy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your policy document and provide some basic details. 
          Our AI will analyze it in 30 seconds to identify risks, gaps, and optimization opportunities.
        </p>
      </div>

      {!canUpload && (
        <div className="card mb-8 border-l-4 border-yellow-400 bg-yellow-50">
          <div className="flex items-center">
            <Crown className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Upgrade Required</h3>
              <p className="text-yellow-700">
                You've reached the upload limit for free accounts. Upgrade to continue analyzing policies.
              </p>
              <button 
                onClick={onUpgradeRequired}
                className="btn btn-primary mt-3"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Upload Policy Document
          </h2>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400'
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Processing your policy...</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-green-700 font-medium">{uploadedFile.name}</p>
                <p className="text-gray-500 text-sm">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your policy document here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, TXT files up to 10MB
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-start space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Your documents are processed securely and not stored permanently. 
              We only extract necessary information for analysis.
            </p>
          </div>
        </div>

        {/* Policy Details Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Policy Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Number
              </label>
              <input
                type="text"
                value={policyDetails.policyNumber}
                onChange={(e) => setPolicyDetails({...policyDetails, policyNumber: e.target.value})}
                className="form-input"
                placeholder="POL123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Provider
              </label>
              <input
                type="text"
                value={policyDetails.insuranceProvider}
                onChange={(e) => setPolicyDetails({...policyDetails, insuranceProvider: e.target.value})}
                className="form-input"
                placeholder="e.g., State Farm, Allstate, Progressive"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coverage Limits
                </label>
                <input
                  type="text"
                  value={policyDetails.limits}
                  onChange={(e) => setPolicyDetails({...policyDetails, limits: e.target.value})}
                  className="form-input"
                  placeholder="$100,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deductible
                </label>
                <input
                  type="text"
                  value={policyDetails.deductible}
                  onChange={(e) => setPolicyDetails({...policyDetails, deductible: e.target.value})}
                  className="form-input"
                  placeholder="$1,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renewal Date
              </label>
              <input
                type="date"
                value={policyDetails.renewalDate}
                onChange={(e) => setPolicyDetails({...policyDetails, renewalDate: e.target.value})}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={!uploadedFile || uploading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5 mr-2" />
              Analyze Policy
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PolicyUpload;