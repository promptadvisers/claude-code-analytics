import axios from 'axios';
import {
  KPIMetrics,
  RegionData,
  ChannelData,
  TrendData,
  MonthlyTrend,
  PriceDistribution,
  FilterOptions,
  DataFilters,
  TableData,
  AnalyticsData
} from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

export const analyticsAPI = {
  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },

  // KPI Metrics
  getKPIMetrics: async (): Promise<KPIMetrics> => {
    const response = await api.get('/kpi');
    return response.data;
  },

  // Revenue by Region
  getRevenueByRegion: async (): Promise<RegionData[]> => {
    const response = await api.get('/revenue-by-region');
    return response.data;
  },

  // Revenue by Channel
  getRevenueByChannel: async (): Promise<ChannelData[]> => {
    const response = await api.get('/revenue-by-channel');
    return response.data;
  },

  // Daily Trends
  getDailyTrends: async (): Promise<TrendData[]> => {
    const response = await api.get('/daily-trends');
    return response.data;
  },

  // Monthly Trends
  getMonthlyTrends: async (): Promise<MonthlyTrend[]> => {
    const response = await api.get('/monthly-trends');
    return response.data;
  },

  // Price Distribution
  getPriceDistribution: async (): Promise<PriceDistribution[]> => {
    const response = await api.get('/price-distribution');
    return response.data;
  },

  // Filter Options
  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await api.get('/filter-options');
    return response.data;
  },

  // Table Data with Filters
  getTableData: async (
    page: number = 1,
    perPage: number = 50,
    sortBy: string = 'Date',
    sortOrder: 'asc' | 'desc' = 'desc',
    filters?: DataFilters
  ): Promise<TableData> => {
    const params: any = {
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    if (filters) {
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      if (filters.regions?.length) params.regions = filters.regions.join(',');
      if (filters.channels?.length) params.channels = filters.channels.join(',');
      if (filters.min_price !== undefined) params.min_price = filters.min_price;
      if (filters.max_price !== undefined) params.max_price = filters.max_price;
    }

    const response = await api.get('/data', { params });
    return response.data;
  },

  // Filtered Analytics
  getFilteredAnalytics: async (filters: DataFilters): Promise<AnalyticsData> => {
    const response = await api.post('/analytics/filtered', filters);
    return response.data;
  },

  // File Upload
  uploadFile: async (file: File): Promise<{ message: string; records: number; backup_file: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default analyticsAPI;