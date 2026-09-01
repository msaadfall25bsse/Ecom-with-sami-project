import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: 'Online Course',
    price: 3900,
    stockLevel: 100,
    stockStatus: 'Digital / Unlimited',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewProduct({ sku: '', name: '', category: 'Online Course', price: 3900, stockLevel: 100, stockStatus: 'Digital / Unlimited', description: '' });
        fetchProducts();
      }
    } catch (err) {
      alert('Error creating product');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Inventory &amp; Course Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            Manage course tiers, software licenses, themes, and downloadable materials.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          <span>Add New Product / Course</span>
        </button>
      </div>

      {/* Inventory Table (Page 6 of Stitch Design) */}
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
                <th style={{ padding: '14px 18px' }}>Product Name</th>
                <th style={{ padding: '14px 18px' }}>SKU</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Stock Level</th>
                <th style={{ padding: '14px 18px' }}>Price</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#FFFFFF' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: '700' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.description || 'Digital Academy Item'}</div>
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: '700' }}>
                      {p.sku}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94A3B8' }}>
                      {p.category}
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
                        {p.stock_status || 'In Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--accent-green)' }}>
                      PKR {p.price?.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <span style={{ color: 'var(--accent-green)', fontWeight: '700', fontSize: '0.8rem' }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                    No products in catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }} onClick={() => setShowAddModal(false)}>
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '100%',
              maxWidth: '520px',
              padding: '32px',
              color: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Add New Product / Course</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '4px' }}>Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Mentorship Upgrade"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '4px' }}>SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP-DROP-01"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '4px' }}>Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
