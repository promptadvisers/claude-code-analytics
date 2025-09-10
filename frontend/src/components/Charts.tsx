import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  RegionData,
  ChannelData,
  TrendData,
  MonthlyTrend,
  PriceDistribution,
} from '../types';

interface ChartsProps {
  regionData: RegionData[];
  channelData: ChannelData[];
  dailyTrends: TrendData[];
  monthlyTrends: MonthlyTrend[];
  priceDistribution: PriceDistribution[];
  loading: boolean;
}

const COLORS = ['#0ea5e9', '#d946ef', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Charts: React.FC<ChartsProps> = ({
  regionData,
  channelData,
  dailyTrends,
  monthlyTrends,
  priceDistribution,
  loading,
}) => {
  // Debug: Log channel data to see what we're receiving
  console.log('Channel Data:', channelData);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="chart-container animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-8">
      {/* Top Row - Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Revenue Trend */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyTrends}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0ea5e9"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year_month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#d946ef"
                strokeWidth={3}
                dot={{ fill: '#d946ef', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#d946ef', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Middle Row - Regional and Channel Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Region */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="total_revenue"
                nameKey="Region"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Channel */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Sales Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={channelData} 
              margin={{ left: 20, right: 20, top: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="Sales_Channel"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar 
                dataKey="total_revenue" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row - Price Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Point Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="Price_Per_Unit" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any, name: string) => {
                  if (name === 'total_revenue') return [formatCurrency(value), 'Revenue'];
                  if (name === 'total_units') return [formatNumber(value), 'Units Sold'];
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="total_revenue" fill="#f59e0b" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total_units" fill="#ef4444" name="Units Sold" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Units vs Revenue Correlation */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Units vs Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis yAxisId="revenue" orientation="left" tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
              <YAxis yAxisId="units" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any, name: string) => {
                  if (name === 'Revenue') return [formatCurrency(value), name];
                  if (name === 'Units') return [formatNumber(value), name];
                  return [value, name];
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Revenue"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="units"
                type="monotone"
                dataKey="units"
                stroke="#06b6d4"
                strokeWidth={3}
                name="Units"
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;