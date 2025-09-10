import React, { useState, useEffect } from 'react';
import { SalesRecord, TableData, DataFilters } from '../types';
import analyticsAPI from '../services/api';

interface DataTableProps {
  filters?: DataFilters;
  refreshTrigger?: number;
}

const DataTable: React.FC<DataTableProps> = ({ filters, refreshTrigger }) => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [perPage] = useState(50);

  const loadTableData = async () => {
    setLoading(true);
    try {
      const data = await analyticsAPI.getTableData(currentPage, perPage, sortBy, sortOrder, filters);
      setTableData(data);
    } catch (error) {
      console.error('Error loading table data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, sortOrder, filters, refreshTrigger]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

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

  const renderPagination = () => {
    if (!tableData || tableData.pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(tableData.pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, tableData.total)} of {tableData.total} records
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(tableData.pages, currentPage + 1))}
            disabled={currentPage === tableData.pages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tableData || tableData.data.length === 0) {
    return (
      <div className="chart-container text-center py-12">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-lg font-medium">No data found</p>
          <p className="text-sm">Try adjusting your filters or upload new data</p>
        </div>
      </div>
    );
  }

  const columns = [
    { key: 'Sale_ID', label: 'Sale ID', sortable: true },
    { key: 'Date', label: 'Date', sortable: true },
    { key: 'Units_Sold', label: 'Units Sold', sortable: true },
    { key: 'Price_Per_Unit', label: 'Price per Unit', sortable: true },
    { key: 'Revenue', label: 'Revenue', sortable: true },
    { key: 'Region', label: 'Region', sortable: true },
    { key: 'Sales_Channel', label: 'Sales Channel', sortable: true },
  ];

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Data Table</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.data.map((record: SalesRecord, index) => (
              <tr key={record.Sale_ID} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 text-sm text-gray-900">{record.Sale_ID}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{new Date(record.Date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(record.Units_Sold)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(record.Price_Per_Unit)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(record.Revenue)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {record.Region}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {record.Sales_Channel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
};

export default DataTable;