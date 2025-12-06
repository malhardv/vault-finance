import { useState, useEffect } from 'react';
import { categoryRuleAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // User profile state
  const [user, setUser] = useState(null);
  
  // Category rules state
  const [categoryRules, setCategoryRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state for new/edit rule
  const [formData, setFormData] = useState({
    keyword: '',
    category: '',
    priority: 0
  });

  useEffect(() => {
    // Load user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchCategoryRules();
  }, []);

  const fetchCategoryRules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryRuleAPI.getCategoryRules();
      setCategoryRules(response.data.data || []);
    } catch (err) {
      console.error('Error fetching category rules:', err);
      setError(err.message || 'Failed to load category rules');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) || 0 : value
    }));
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setSuccessMessage(null);
      
      await categoryRuleAPI.createCategoryRule(formData);
      
      setSuccessMessage('Category rule added successfully');
      setFormData({ keyword: '', category: '', priority: 0 });
      setShowAddForm(false);
      
      // Refresh the list
      await fetchCategoryRules();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error adding category rule:', err);
      setError(err.message || 'Failed to add category rule');
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule._id);
    setFormData({
      keyword: rule.keyword,
      category: rule.category,
      priority: rule.priority
    });
    setShowAddForm(false);
  };

  const handleUpdateRule = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setSuccessMessage(null);
      
      await categoryRuleAPI.updateCategoryRule(editingRule, formData);
      
      setSuccessMessage('Category rule updated successfully');
      setFormData({ keyword: '', category: '', priority: 0 });
      setEditingRule(null);
      
      // Refresh the list
      await fetchCategoryRules();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating category rule:', err);
      setError(err.message || 'Failed to update category rule');
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category rule?')) {
      return;
    }
    
    try {
      setError(null);
      setSuccessMessage(null);
      
      await categoryRuleAPI.deleteCategoryRule(id);
      
      setSuccessMessage('Category rule deleted successfully');
      
      // Refresh the list
      await fetchCategoryRules();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting category rule:', err);
      setError(err.message || 'Failed to delete category rule');
    }
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setFormData({ keyword: '', category: '', priority: 0 });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormData({ keyword: '', category: '', priority: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage your profile and category rules</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

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

          {/* User Profile Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Profile</h2>
            {user ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{user.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No user information available</p>
            )}
          </div>

          {/* Category Rules Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Category Rules</h2>
              {!showAddForm && !editingRule && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Rule
                </button>
              )}
            </div>

            {/* Add Rule Form */}
            {showAddForm && (
              <form onSubmit={handleAddRule} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category Rule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                      Keyword *
                    </label>
                    <input
                      type="text"
                      id="keyword"
                      name="keyword"
                      value={formData.keyword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ZOMATO"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Food"
                    />
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <input
                      type="number"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Rule
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAdd}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Category Rules List */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="ml-3 text-gray-600">Loading category rules...</p>
              </div>
            ) : categoryRules.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No category rules found. Add your first rule to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keyword
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryRules.map((rule) => (
                      <tr key={rule._id}>
                        {editingRule === rule._id ? (
                          <>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                name="keyword"
                                value={formData.keyword}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button
                                onClick={handleUpdateRule}
                                className="text-green-600 hover:text-green-800 font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-800 font-medium"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {rule.keyword}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {rule.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {rule.priority}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEditRule(rule)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteRule(rule._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
