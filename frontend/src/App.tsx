import React, { useState, useEffect } from 'react';
import KPICards from './components/KPICards';
import Charts from './components/Charts';
import DataTable from './components/DataTable';
import FileUpload from './components/FileUpload';
import analyticsAPI from './services/api';
import {
  KPIMetrics,
  RegionData,
  ChannelData,
  TrendData,
  MonthlyTrend,
  PriceDistribution,
  FilterOptions,
  DataFilters,
} from './types';

function App() {
  // State for dashboard data
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetrics | null>(null);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [dailyTrends, setDailyTrends] = useState<TrendData[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [priceDistribution, setPriceDistribution] = useState<PriceDistribution[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  
  // State for UI
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DataFilters>({});
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Load all dashboard data
  const loadDashboardData = async (filters?: DataFilters) => {
    setLoading(true);
    try {
      if (filters && Object.keys(filters).length > 0) {
        // Load filtered data
        const analyticsData = await analyticsAPI.getFilteredAnalytics(filters);
        setKpiMetrics(analyticsData.kpi);
        setRegionData(analyticsData.revenue_by_region);
        setChannelData(analyticsData.revenue_by_channel);
        setDailyTrends(analyticsData.daily_trends);
        setMonthlyTrends(analyticsData.monthly_trends);
        setPriceDistribution(analyticsData.price_distribution);
      } else {
        // Load all data in parallel
        const [
          kpi,
          regions,
          channels,
          daily,
          monthly,
          prices,
          options,
        ] = await Promise.all([
          analyticsAPI.getKPIMetrics(),
          analyticsAPI.getRevenueByRegion(),
          analyticsAPI.getRevenueByChannel(),
          analyticsAPI.getDailyTrends(),
          analyticsAPI.getMonthlyTrends(),
          analyticsAPI.getPriceDistribution(),
          analyticsAPI.getFilterOptions(),
        ]);

        setKpiMetrics(kpi);
        setRegionData(regions);
        setChannelData(channels);
        setDailyTrends(daily);
        setMonthlyTrends(monthly);
        setPriceDistribution(prices);
        setFilterOptions(options);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadDashboardData();
  }, [refreshTrigger]);

  // Handle file upload success
  const handleUploadSuccess = () => {
    setShowUpload(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle filter changes
  const handleFiltersChange = (filters: DataFilters) => {
    setActiveFilters(filters);
    loadDashboardData(filters);
  };

  // Clear filters
  const clearFilters = () => {
    setActiveFilters({});
    loadDashboardData();
  };

  // Filter component
  const FilterPanel = () => {
    if (!filterOptions || !filtersVisible) return null;

    return (
      <div className="glass-card p-6 mb-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={activeFilters.start_date || ''}
                onChange={(e) => handleFiltersChange({ ...activeFilters, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={activeFilters.end_date || ''}
                onChange={(e) => handleFiltersChange({ ...activeFilters, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End Date"
              />
            </div>
          </div>

          {/* Regions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Regions</label>
            <select
              multiple
              value={activeFilters.regions || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleFiltersChange({ ...activeFilters, regions: selected });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={3}
            >
              {filterOptions.regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Channels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Channels</label>
            <select
              multiple
              value={activeFilters.channels || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleFiltersChange({ ...activeFilters, channels: selected });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={3}
            >
              {filterOptions.channels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="space-y-2">
              <input
                type="number"
                value={activeFilters.min_price || ''}
                onChange={(e) => handleFiltersChange({ ...activeFilters, min_price: parseFloat(e.target.value) || undefined })}
                placeholder={`Min ($${filterOptions.price_range.min})`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={activeFilters.max_price || ''}
                onChange={(e) => handleFiltersChange({ ...activeFilters, max_price: parseFloat(e.target.value) || undefined })}
                placeholder={`Max ($${filterOptions.price_range.max})`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 mb-8">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">AI Note-Taking Pin Sales Analytics</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filtersVisible
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                🔍 Filters
              </button>
              
              <button
                onClick={() => setShowUpload(!showUpload)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showUpload
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                📤 Upload Data
              </button>
              
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                disabled={loading}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
              >
                {loading ? '🔄' : '↻'} Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8">
        {/* File Upload */}
        {showUpload && (
          <div className="mb-8">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Filters */}
        <FilterPanel />

        {/* KPI Cards */}
        <KPICards metrics={kpiMetrics} loading={loading} />

        {/* Charts */}
        <div className="mb-8">
          <Charts
            regionData={regionData}
            channelData={channelData}
            dailyTrends={dailyTrends}
            monthlyTrends={monthlyTrends}
            priceDistribution={priceDistribution}
            loading={loading}
          />
        </div>

        {/* Data Table */}
        <DataTable 
          filters={activeFilters} 
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading analytics...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;