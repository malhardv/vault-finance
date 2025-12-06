import { useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PieChart from '../components/charts/PieChart';

const Portfolio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    investmentName: '',
    initialAmount: '',
    currentValue: '',
    investmentDate: ''
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoadingPortfolio(true);
      setError(null);
      
      const response = await portfolioAPI.getPortfolio();
      setPortfolio(response.data.data || []);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err.message || 'Failed to load portfolio');
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      investmentName: '',
      initialAmount: '',
      currentValue: '',
      investmentDate: ''
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate inputs
      if (!formData.investmentName || !formData.initialAmount || !formData.currentValue || !formData.investmentDate) {
        setError('All fields are required');
        return;
      }

      const initialAmount = parseFloat(formData.initialAmount);
      const currentValue = parseFloat(formData.currentValue);
      
      if (isNaN(initialAmount) || initialAmount <= 0) {
        setError('Initial amount must be a valid positive number');
        return;
      }

      if (isNaN(currentValue) || currentValue < 0) {
        setError('Current value must be a valid non-negative number');
        return;
      }

      const investmentData = {
        investmentName: formData.investmentName.trim(),
        initialAmount,
        currentValue,
        investmentDate: formData.investmentDate
      };

      await portfolioAPI.createInvestment(investmentData);
      setSuccess('Investment added successfully!');

      // Refresh portfolio
      await fetchPortfolio();
      
      // Reset form
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving investment:', err);
      setError(err.message || 'Failed to save investment');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateGainLoss = (investment) => {
    return investment.currentValue - investment.initialAmount;
  };

  const calculateGainLossPercentage = (investment) => {
    const gainLoss = calculateGainLoss(investment);
    return (gainLoss / investment.initialAmount) * 100;
  };

  const calculateCAGR = (investment) => {
    const investmentDate = new Date(investment.investmentDate);
    const today = new Date();
    const years = (today - investmentDate) / (1000 * 60 * 60 * 24 * 365.25);
    
    if (years <= 0) return 0;
    
    const cagr = (Math.pow(investment.currentValue / investment.initialAmount, 1 / years) - 1) * 100;
    return cagr;
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((sum, inv) => sum + inv.currentValue, 0);
  };

  const calculateTotalInvested = () => {
    return portfolio.reduce((sum, inv) => sum + inv.initialAmount, 0);
  };

  const calculateTotalGainLoss = () => {
    return calculateTotalValue() - calculateTotalInvested();
  };

  const calculateAllocation = (investment) => {
    const totalValue = calculateTotalValue();
    if (totalValue === 0) return 0;
    return (investment.currentValue / totalValue) * 100;
  };

  // Prepare data for allocation pie chart
  const allocationData = portfolio.map(inv => ({
    category: inv.investmentName,
    amount: inv.currentValue
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Investment Portfolio</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Track your investments and monitor performance</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          )}

          {/* Portfolio Summary Cards */}
          {portfolio.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Invested</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(calculateTotalInvested())}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(calculateTotalValue())}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Gain/Loss</p>
                    <p className={`text-2xl font-bold ${calculateTotalGainLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateTotalGainLoss() >= 0 ? '+' : ''}{formatCurrency(calculateTotalGainLoss())}
                    </p>
                    <p className={`text-sm ${calculateTotalGainLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateTotalGainLoss() >= 0 ? '+' : ''}
                      {calculateTotalInvested() > 0 ? ((calculateTotalGainLoss() / calculateTotalInvested()) * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${calculateTotalGainLoss() >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <svg className={`w-6 h-6 ${calculateTotalGainLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Investment Button */}
          {!showForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Investment
              </button>
            </div>
          )}

          {/* Investment Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Investment</h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Investment Name */}
                  <div>
                    <label htmlFor="investmentName" className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Name
                    </label>
                    <input
                      type="text"
                      id="investmentName"
                      name="investmentName"
                      value={formData.investmentName}
                      onChange={handleInputChange}
                      placeholder="e.g., Apple Stock, Bitcoin"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Initial Amount */}
                  <div>
                    <label htmlFor="initialAmount" className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Amount
                    </label>
                    <input
                      type="number"
                      id="initialAmount"
                      name="initialAmount"
                      value={formData.initialAmount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Current Value */}
                  <div>
                    <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Value
                    </label>
                    <input
                      type="number"
                      id="currentValue"
                      name="currentValue"
                      value={formData.currentValue}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Investment Date */}
                  <div>
                    <label htmlFor="investmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Date
                    </label>
                    <input
                      type="date"
                      id="investmentDate"
                      name="investmentDate"
                      value={formData.investmentDate}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Saving...' : 'Add Investment'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Portfolio Allocation Chart */}
          {portfolio.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Allocation</h2>
              <PieChart data={allocationData} />
            </div>
          )}

          {/* Investments List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Investments</h2>
            </div>

            {loadingPortfolio ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <p className="mt-3 text-gray-600">Loading portfolio...</p>
                </div>
              </div>
            ) : portfolio.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-gray-600 mb-2">No investments yet</p>
                <p className="text-sm text-gray-500">Add your first investment to start tracking</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {portfolio.map((investment) => {
                  const gainLoss = calculateGainLoss(investment);
                  const gainLossPercentage = calculateGainLossPercentage(investment);
                  const cagr = calculateCAGR(investment);
                  const allocation = calculateAllocation(investment);
                  
                  return (
                    <div key={investment._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {investment.investmentName}
                            </h3>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {allocation.toFixed(1)}% of portfolio
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Initial Investment</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(investment.initialAmount)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Current Value</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(investment.currentValue)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Gain/Loss</p>
                              <p className={`text-lg font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
                              </p>
                              <p className={`text-sm ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {gainLoss >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">CAGR</p>
                              <p className={`text-lg font-semibold ${cagr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {cagr >= 0 ? '+' : ''}{cagr.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">
                              Investment Date: {formatDate(investment.investmentDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;
