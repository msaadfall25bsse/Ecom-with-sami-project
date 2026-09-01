import React, { useState, useEffect } from 'react';
import { Users, Search, UserCheck, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      let url = '/api/admin/students';
      if (searchTerm) url += `?search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.students || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header (Page 7 of Stitch Design) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Customer Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            Manage your customer database and track their purchasing history.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by customer name or email..."
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
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Customers Table (Page 7 of Stitch Design) */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '14px 18px' }}>Customer Name</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Total Orders</th>
                <th style={{ padding: '14px 18px' }}>Total Spent</th>
                <th style={{ padding: '14px 18px' }}>Last Active</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#FFFFFF' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 160, 223, 0.15)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.82rem'
                        }}>
                          {c.name ? c.name[0] : 'C'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700' }}>{c.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--accent-green)'
                      }}>
                        Active
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#E2E8F0', fontWeight: '600' }}>
                      1 Course
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--accent-green)' }}>
                      PKR 3,900
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94A3B8', fontSize: '0.8rem' }}>
                      {c.last_active_at ? new Date(c.last_active_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <a
                        href="/admin/students"
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(0, 160, 223, 0.15)',
                          color: 'var(--primary)',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '700'
                        }}
                      >
                        View Record
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                    No customer records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
