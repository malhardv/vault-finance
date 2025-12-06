import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FileUpload from '../components/FileUpload';
import { transactionAPI } from '../services/api';

const UploadStatement = () => {
  const navigate = useNavigate();
  const [uploadError, setUploadError] = useState('');

  const handleUpload = async (file) => {
    try {
      setUploadError('');
      
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('statement', file);

      // Call the upload API
      const response = await transactionAPI.uploadStatement(formData);

      // Show success message (FileUpload component handles this)
      // Redirect to transactions page after a short delay
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);

      return response;
    } catch (error) {
      setUploadError(error.message || 'Failed to upload statement');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Upload Bank Statement
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Upload your bank statement in PDF or CSV format to automatically extract and categorize your transactions.
              </p>
            </div>

            {/* Upload Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Before you upload:
              </h2>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Ensure your statement is in PDF or CSV format</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>File size should not exceed 10MB</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Transactions will be automatically categorized based on keywords</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>You'll be redirected to view your transactions after upload</span>
                </li>
              </ul>
            </div>

            {/* File Upload Component */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <FileUpload 
                onUpload={handleUpload}
                acceptedTypes=".pdf,.csv"
                maxSizeMB={10}
              />
            </div>

            {/* Additional Error Display (if needed) */}
            {uploadError && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 font-medium">{uploadError}</span>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="mt-8 bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Need Help?
              </h3>
              <p className="text-gray-700 mb-2">
                If you're having trouble uploading your statement, make sure:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                <li>The file is not password-protected</li>
                <li>The file contains transaction data in a readable format</li>
                <li>Your internet connection is stable</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadStatement;
