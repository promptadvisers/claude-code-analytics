export interface SalesRecord {
  Sale_ID: number;
  Date: string;
  Units_Sold: number;
  Price_Per_Unit: number;
  Revenue: number;
  Region: string;
  Sales_Channel: string;
}

export interface KPIMetrics {
  total_revenue: number;
  total_units: number;
  avg_price: number;
  total_transactions: number;
  avg_units_per_sale: number;
  revenue_per_transaction: number;
  top_region?: string;
  top_region_revenue?: number;
  top_channel?: string;
  top_channel_revenue?: number;
}

export interface RegionData {
  Region: string;
  total_revenue: number;
  total_units: number;
  transaction_count: number;
}

export interface ChannelData {
  Sales_Channel: string;
  total_revenue: number;
  total_units: number;
  transaction_count: number;
}

export interface TrendData {
  date: string;
  revenue: number;
  units: number;
  transactions: number;
}

export interface MonthlyTrend {
  year_month: string;
  revenue: number;
  units: number;
  transactions: number;
  avg_price: number;
}

export interface PriceDistribution {
  Price_Per_Unit: number;
  total_revenue: number;
  total_units: number;
  transaction_count: number;
}

export interface FilterOptions {
  regions: string[];
  channels: string[];
  price_range: {
    min: number;
    max: number;
  };
  date_range: {
    start: string;
    end: string;
  };
}

export interface DataFilters {
  start_date?: string;
  end_date?: string;
  regions?: string[];
  channels?: string[];
  min_price?: number;
  max_price?: number;
}

export interface TableData {
  data: SalesRecord[];
  total: number;
  pages: number;
  current_page: number;
}

export interface AnalyticsData {
  kpi: KPIMetrics;
  revenue_by_region: RegionData[];
  revenue_by_channel: ChannelData[];
  daily_trends: TrendData[];
  monthly_trends: MonthlyTrend[];
  price_distribution: PriceDistribution[];
}