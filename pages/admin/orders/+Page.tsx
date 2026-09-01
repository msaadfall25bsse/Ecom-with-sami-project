import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Download, Filter, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      let url = `/api/admin/orders?status=${statusFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order Number,Customer Name,Customer Email,Customer Phone,Amount,Payment Method,Status,Date\n'];
    const rows = orders.map(o => 
      `"${o.order_number}","${o.customer_name}","${o.customer_email}","${o.customer_phone || ''}","${o.amount}","${o.payment_method}","${o.status}","${o.created_at}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sami-orders-export-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Orders Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            Manage course enrollment purchases, track fulfillment states, and export transaction reports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={16} />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* 4 Stat KPI Cards (From Page 6 of Stitch Design) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Total Orders</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF' }}>1,248</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', marginTop: '4px' }}>+12% vs last month</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Pending Orders</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-amber)' }}>42</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Awaiting verification</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Shipped / Activated</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-green)' }}>856</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Instant access granted</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Total Revenue</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>Rs 4,520,000</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Gross completed sales</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { label: 'All Orders', val: 'all' },
            { label: 'Paid', val: 'Paid' },
            { label: 'Pending', val: 'Pending' },
            { label: 'Cancelled', val: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: statusFilter === tab.val ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: statusFilter === tab.val ? 'rgba(0, 160, 223, 0.15)' : 'transparent',
                color: statusFilter === tab.val ? '#FFFFFF' : '#94A3B8',
                fontWeight: statusFilter === tab.val ? '700' : '500',
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0, width: '100%', maxWidth: '100%' }}>
          <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              backgroundColor: '#1E293B',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-responsive">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.74rem', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Order ID</th>
              <th style={{ padding: '12px 16px' }}>Customer</th>
              <th style={{ padding: '12px 16px' }}>Contact</th>
              <th style={{ padding: '12px 16px' }}>Payment Method</th>
              <th style={{ padding: '12px 16px' }}>Amount</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '100px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '130px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '140px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '90px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '80px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '70px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '90px', height: '18px' }} /></td>
                </tr>
              ))
            ) : orders.length > 0 ? (
                orders.map(ord => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#FFFFFF' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: '700' }}>
                      {ord.order_number}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '700' }}>
                      {ord.customer_name}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div>{ord.customer_email}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{ord.customer_phone || '-'}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94A3B8' }}>
                      {ord.payment_method}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--accent-green)' }}>
                      PKR {ord.amount?.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        backgroundColor: ord.status === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : ord.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: ord.status === 'Paid' ? 'var(--accent-green)' : ord.status === 'Pending' ? 'var(--accent-amber)' : 'var(--accent-red)'
                      }}>
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94A3B8', fontSize: '0.8rem' }}>
                      {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

    </div>
  );
}
