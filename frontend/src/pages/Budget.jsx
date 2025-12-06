import { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const Budget = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [month, setMonth] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState([
    { category: '', limit: '' }
  ]);
  
  // Budget status state
  const [budgetData, setBudgetData] = useState(null);
  const [loadingBudget, setLoadingBudget] = useState(false);

  // Initialize month to current month
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const monthNum = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${monthNum}`;
    setMonth(currentMonth);
    
    // Fetch budget for current month
    fetchBudget(currentMonth);
  }, []);

  const fetchBudget = async (selectedMonth) => {
    try {
      setLoadingBudget(true);
      setError(null);
      
      const response = await budgetAPI.getBudget({ month: selectedMonth });
      setBudgetData(response.data.data);
    } catch (err) {
      // If no budget found, that's okay - user can create one
      if (err.message.includes('No budget found')) {
        setBudgetData(null);
      } else {
        console.error('Error fetching budget:', err);
        setError(err.message || 'Failed to load budget data');
      }
    } finally {
      setLoadingBudget(false);
    }
  };

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    fetchBudget(newMonth);
  };

  const handleAddCategory = () => {
    setCategoryBudgets([...categoryBudgets, { category: '', limit: '' }]);
  };

  const handleRemoveCategory = (index) => {
    const updated = categoryBudgets.filter((_, i) => i !== index);
    setCategoryBudgets(updated);
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categoryBudgets];
    updated[index][field] = value;
    setCategoryBudgets(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate inputs
      if (!month || !totalBudget) {
        setError('Month and total budget are required');
        return;
      }

      const totalBudgetNum = parseFloat(totalBudget);
      if (isNaN(totalBudgetNum) || totalBudgetNum < 0) {
        setError('Total budget must be a valid positive number');
        return;
      }

      // Filter out empty category budgets and convert to numbers
      const validCategoryBudgets = categoryBudgets
        .filter(cb => cb.category && cb.limit)
        .map(cb => ({
          category: cb.category.trim(),
          limit: parseFloat(cb.limit)
        }));

      // Validate category budgets
      for (const cb of validCategoryBudgets) {
        if (isNaN(cb.limit) || cb.limit < 0) {
          setError('All category limits must be valid positive numbers');
          return;
        }
      }

      const budgetData = {
        month,
        totalBudget: totalBudgetNum,
        categoryBudgets: validCategoryBudgets
      };

      await budgetAPI.createBudget(budgetData);
      
      setSuccess('Budget saved successfully!');
      
      // Refresh budget data
      fetchBudget(month);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating budget:', err);
      setError(err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const getProgressBarColor = (percentageUsed) => {
    if (percentageUsed >= 100) return 'bg-red-600';
    if (percentageUsed >= 80) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Budget Management</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Set and track your monthly spending limits</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Budget Creation Form */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Create/Update Budget
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Month Selection */}
                <div>
                  <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <input
                    type="month"
                    id="month"
                    value={month}
                    onChange={handleMonthChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Total Budget */}
                <div>
                  <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700 mb-2">
                    Total Monthly Budget
                  </label>
                  <input
                    type="number"
                    id="totalBudget"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="Enter total budget"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category Budgets */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Category Budgets (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add Category
                    </button>
                  </div>

                  <div className="space-y-3">
                    {categoryBudgets.map((catBudget, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={catBudget.category}
                          onChange={(e) => handleCategoryChange(index, 'category', e.target.value)}
                          placeholder="Category name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="number"
                          value={catBudget.limit}
                          onChange={(e) => handleCategoryChange(index, 'limit', e.target.value)}
                          placeholder="Limit"
                          step="0.01"
                          min="0"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        {categoryBudgets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Saving...' : 'Save Budget'}
                </button>
              </form>
            </div>

            {/* Budget Status Display */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Budget Status
              </h2>

              {loadingBudget ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="mt-3 text-gray-600">Loading budget...</p>
                  </div>
                </div>
              ) : budgetData ? (
                <div className="space-y-6">
                  {/* Overall Budget Summary */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">Overall Budget</h3>
                      {budgetData.totalExceeded && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                          EXCEEDED
                        </span>
                      )}
                      {budgetData.totalWarning && !budgetData.totalExceeded && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          WARNING
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium text-gray-900">
                          ₹{budgetData.totalBudget.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent:</span>
                        <span className="font-medium text-gray-900">
                          ₹{budgetData.totalSpending.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining:</span>
                        <span className={`font-medium ${budgetData.totalRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{budgetData.totalRemaining.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{budgetData.totalPercentageUsed.toFixed(1)}% used</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(budgetData.totalPercentageUsed)}`}
                          style={{ width: `${Math.min(budgetData.totalPercentageUsed, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Category Budgets */}
                  {budgetData.categoryBudgets && budgetData.categoryBudgets.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Category Budgets</h3>
                      <div className="space-y-4">
                        {budgetData.categoryBudgets.map((catBudget, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{catBudget.category}</h4>
                              {catBudget.exceeded && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                                  EXCEEDED
                                </span>
                              )}
                              {catBudget.warning && !catBudget.exceeded && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                                  WARNING
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-sm mb-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Limit:</span>
                                <span className="font-medium">₹{catBudget.limit.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Spent:</span>
                                <span className="font-medium">₹{catBudget.spent.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Remaining:</span>
                                <span className={`font-medium ${catBudget.remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ₹{catBudget.remaining.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Category Progress Bar */}
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>{catBudget.percentageUsed.toFixed(1)}% used</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(catBudget.percentageUsed)}`}
                                  style={{ width: `${Math.min(catBudget.percentageUsed, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 mb-2">No budget set for this month</p>
                  <p className="text-sm text-gray-500">Create a budget using the form on the left</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Budget;
