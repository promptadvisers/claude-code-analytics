import React from 'react';
import { KPIMetrics } from '../types';

interface KPICardsProps {
  metrics: KPIMetrics | null;
  loading: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ metrics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="metric-card text-center text-gray-500">
        No data available
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

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.total_revenue),
      subtitle: `${formatNumber(metrics.total_transactions)} transactions`,
      icon: '💰',
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Units Sold',
      value: formatNumber(metrics.total_units),
      subtitle: `${metrics.avg_units_per_sale.toFixed(1)} avg per sale`,
      icon: '📦',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Average Price',
      value: formatCurrency(metrics.avg_price),
      subtitle: `${formatCurrency(metrics.revenue_per_transaction)} per transaction`,
      icon: '💲',
      color: 'from-purple-500 to-violet-600',
    },
    {
      title: 'Top Region',
      value: metrics.top_region || 'N/A',
      subtitle: metrics.top_region_revenue ? formatCurrency(metrics.top_region_revenue) : '',
      icon: '🌍',
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="metric-card group relative overflow-hidden"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{card.icon}</div>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
            </div>
            
            <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
            {card.subtitle && (
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            )}
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;