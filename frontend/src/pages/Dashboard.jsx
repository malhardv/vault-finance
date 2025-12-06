import { useState, useEffect } from 'react';
import { dashboardAPI, transactionAPI } from '../services/api';
import Card from '../components/Card';
import PieChart from '../components/charts/PieChart';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard data state
  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState([]);
  
  // Summary data state
  const [totalSpending, setTotalSpending] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentMonth = getCurrentMonth();

      // Fetch all dashboard data in parallel
      const [categoryRes, trendsRes, incomeExpenseRes, summaryRes] = await Promise.all([
        dashboardAPI.getCategorySpending({ month: currentMonth }),
        dashboardAPI.getMonthlyTrends({ months: 6 }),
        dashboardAPI.getIncomeExpense({ months: 6 }),
        transactionAPI.getMonthlySummary({ month: currentMonth })
      ]);

      // Set category spending data for pie chart
      setCategorySpending(categoryRes.data.data.categorySpending || []);

      // Set monthly trends data for line chart
      setMonthlyTrends(trendsRes.data.data.monthlyTrends || []);

      // Transform income/expense data for bar chart
      // Backend returns { income: [...], expense: [...] }
      // BarChart expects [{ month, income, expense }, ...]
      const incomeData = incomeExpenseRes.data.data.income || [];
      const expenseData = incomeExpenseRes.data.data.expense || [];
      
      const combinedData = incomeData.map((incomeItem, index) => ({
        month: incomeItem.month,
        income: incomeItem.amount,
        expense: expenseData[index]?.amount || 0
      }));
      
      setIncomeExpenseData(combinedData);

      // Set summary data from monthly summary
      const summary = summaryRes.data.data;
      setTotalSpending(summary.totalSpending || 0);
      setTotalIncome(summary.totalIncome || 0);
      setBalance((summary.totalIncome || 0) - (summary.totalSpending || 0));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchDashboardData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Overview of your financial health</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card
              title="Total Spending"
              value={`₹${totalSpending.toFixed(2)}`}
              subtitle="Current month"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <Card
              title="Total Income"
              value={`₹${totalIncome.toFixed(2)}`}
              subtitle="Current month"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <Card
              title="Balance"
              value={`₹${balance.toFixed(2)}`}
              subtitle="Income - Spending"
              trend={balance >= 0 ? 'up' : 'down'}
              trendValue={balance >= 0 ? 'Positive' : 'Negative'}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Category Spending Pie Chart */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Spending by Category
              </h2>
              <PieChart data={categorySpending} />
            </div>

            {/* Monthly Trends Line Chart */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Monthly Spending Trends
              </h2>
              <LineChart data={monthlyTrends} />
            </div>

            {/* Income vs Expense Bar Chart */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:col-span-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Income vs Expense
              </h2>
              <BarChart data={incomeExpenseData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
