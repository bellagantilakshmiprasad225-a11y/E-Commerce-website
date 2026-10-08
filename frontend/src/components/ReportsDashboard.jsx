import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp, RefreshCw, FileText, BarChart2 } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const ReportsDashboard = ({ onViewInvoice }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_KEY = import.meta.env.VITE_API_KEY || 'aura_store_api_key_sec_987654321_x';
      const response = await fetch('/api/reports/sales', {
        headers: { 'x-api-key': API_KEY }
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to load sales report data.');
      }

      setReportData(json.data);
    } catch (err) {
      setError(err.message || 'Error fetching report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-secondary)' }}>
        <RefreshCw size={36} className="spin" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 1rem auto' }} />
        <p style={{ fontWeight: 600 }}>Executing SQL Aggregate Queries for Billing Reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(198, 40, 40, 0.3)', borderRadius: '12px', padding: '2rem', color: 'var(--status-danger-text)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.2rem' }}>Failed to generate sales report</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>
        <button
          className="add-btn"
          style={{ margin: '1rem auto 0 auto' }}
          onClick={fetchReport}
        >
          <RefreshCw size={14} /> Retry Query
        </button>
      </div>
    );
  }

  const { summary, revenue_per_order = [], sales_per_category = [] } = reportData || {};
  const maxCategoryRevenue = Math.max(...sales_per_category.map(c => c.revenue), 1);

  return (
    <div className="reports-container" id="reports-dashboard">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent-navy)' }}>
            Sales & Billing Analytics
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Real-time aggregate reporting generated via SQL database queries
          </p>
        </div>

        <button className="category-pill" onClick={fetchReport} title="Refresh Analytics">
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Metric KPI Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon gold">
            <DollarSign size={26} />
          </div>
          <div>
            <div className="metric-val">{formatINR(summary?.gross_revenue)}</div>
            <div className="metric-lbl">Total Gross Revenue</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon navy">
            <ShoppingBag size={26} />
          </div>
          <div>
            <div className="metric-val">{summary?.total_orders || 0}</div>
            <div className="metric-lbl">Total Orders Placed</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon emerald">
            <Package size={26} />
          </div>
          <div>
            <div className="metric-val">{summary?.total_items_sold || 0}</div>
            <div className="metric-lbl">Total Units Sold</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon charcoal">
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="metric-val">{formatINR(summary?.average_order_value)}</div>
            <div className="metric-lbl">Average Order Value</div>
          </div>
        </div>
      </div>

      {/* Category Sales Breakdown */}
      <div className="reports-section">
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--accent-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BarChart2 size={22} color="#B8963E" />
          Sales per Category (SQL Aggregate)
        </h3>

        {sales_per_category.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No category sales data recorded yet.</p>
        ) : (
          sales_per_category.map((cat) => {
            const percentage = Math.round((cat.revenue / maxCategoryRevenue) * 100);
            return (
              <div key={cat.category_id} className="category-bar-item">
                <div className="bar-header">
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.category_name}</span>
                  <span>
                    <strong style={{ color: 'var(--accent-navy)' }}>{formatINR(cat.revenue)}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}>
                      ({cat.total_units_sold} units)
                    </span>
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Revenue per Order Table */}
      <div className="reports-section">
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--accent-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText size={22} color="#1B2A41" />
          Revenue per Order
        </h3>

        {revenue_per_order.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No orders recorded in the system.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name & Email</th>
                  <th>Order Date</th>
                  <th className="num">Items</th>
                  <th className="num">Order Total</th>
                  <th className="num">Action</th>
                </tr>
              </thead>
              <tbody>
                {revenue_per_order.map((ord) => (
                  <tr key={ord.order_id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-navy)' }}>#{ord.order_id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ord.customer_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ord.customer_email}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(ord.order_date).toLocaleString('en-IN')}
                    </td>
                    <td className="num">{ord.items_count}</td>
                    <td className="num" style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>
                      {formatINR(ord.grand_total)}
                    </td>
                    <td className="num">
                      <button
                        className="qty-btn"
                        style={{ width: 'auto', padding: '5px 12px', fontSize: '0.78rem', borderRadius: '4px' }}
                        onClick={() => onViewInvoice(ord.order_id)}
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;
