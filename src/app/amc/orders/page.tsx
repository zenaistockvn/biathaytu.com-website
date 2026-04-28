'use client';

import { useState, useEffect } from 'react';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN');
}

export default function AMCOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/orders?';
      if (filterStatus !== 'all') url += `status=${filterStatus}&`;
      if (search) url += `search=${search}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        // Optimistic update
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const failedEmailsCount = orders.filter(o => !o.email_sent).length;

  const statusLabels: Record<string, string> = {
    'new': 'Mới',
    'confirmed': 'Đã xác nhận',
    'shipping': 'Đang giao',
    'delivered': 'Đã giao',
    'cancelled': 'Đã hủy'
  };

  return (
    <div className="amc-page orders-page">
      <div className="amc-page-header">
        <div>
          <h1 className="amc-page-title">📦 Quản Lý Đơn Hàng</h1>
          <p className="amc-page-subtitle">Theo dõi và cập nhật trạng thái đơn hàng</p>
        </div>
        {failedEmailsCount > 0 && (
          <div className="email-fail-badge" style={{ background: '#fef2f2', color: '#991b1b', padding: '8px 16px', borderRadius: '8px', border: '1px solid #f87171', fontWeight: 600 }}>
            ⚠️ Có {failedEmailsCount} đơn chưa gửi được email. Vui lòng kiểm tra và xử lý thủ công!
          </div>
        )}
      </div>

      <div className="amc-filters" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="amc-input"
          style={{ width: '200px' }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <input 
            type="text" 
            placeholder="Tìm theo mã đơn hoặc SĐT..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="amc-input"
            style={{ flex: 1 }}
          />
          <button type="submit" className="amc-btn-primary">Tìm kiếm</button>
        </form>
      </div>

      <div className="amc-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Không tìm thấy đơn hàng nào.</div>
        ) : (
          <table className="amc-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>SĐT</th>
                <th>Thời Gian</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className={!order.email_sent ? 'row-warning' : ''} style={!order.email_sent ? { backgroundColor: '#fffbfb' } : {}}>
                  <td style={{ fontWeight: 600 }}>
                    {order.order_number}
                    {!order.email_sent && <span title="Lỗi gửi email" style={{ marginLeft: '6px' }}>⚠️</span>}
                  </td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_phone}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(order.total_price)}</td>
                  <td>
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`order-status-badge status-${order.status}`}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      {Object.entries(statusLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="amc-btn-outline"
                      style={{ padding: '4px 12px', fontSize: '13px' }}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="amc-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="amc-modal" style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Chi Tiết Đơn Hàng <span style={{ color: 'var(--primary)' }}>{selectedOrder.order_number}</span></h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Thông tin khách hàng</h3>
                <p><strong>Tên:</strong> {selectedOrder.customer_name}</p>
                <p><strong>SĐT:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email || 'Không có'}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.customer_address}</p>
                <p><strong>Ghi chú:</strong> {selectedOrder.customer_note || 'Không có'}</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Thông tin đơn hàng</h3>
                <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.created_at)}</p>
                <p><strong>Trạng thái:</strong> <span className={`status-${selectedOrder.status}`}>{statusLabels[selectedOrder.status]}</span></p>
                <p><strong>Email thông báo:</strong> {selectedOrder.email_sent ? '✅ Đã gửi' : '❌ Thất bại'}</p>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Sản phẩm</h3>
            <table className="amc-table" style={{ marginBottom: '24px' }}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th style={{ textAlign: 'center' }}>SL</th>
                  <th style={{ textAlign: 'right' }}>Đơn giá</th>
                  <th style={{ textAlign: 'right' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.order_items?.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{formatPrice(item.price)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', padding: '12px' }}>Tạm tính:</td>
                  <td style={{ textAlign: 'right', padding: '12px', fontWeight: 600 }}>{formatPrice(selectedOrder.sub_total)}</td>
                </tr>
                {selectedOrder.auto_discount > 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', padding: '12px', color: 'green' }}>Giảm giá tự động:</td>
                    <td style={{ textAlign: 'right', padding: '12px', color: 'green', fontWeight: 600 }}>-{formatPrice(selectedOrder.auto_discount)}</td>
                  </tr>
                )}
                {selectedOrder.promo_discount > 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', padding: '12px', color: 'green' }}>Mã KM ({selectedOrder.promo_code}):</td>
                    <td style={{ textAlign: 'right', padding: '12px', color: 'green', fontWeight: 600 }}>-{formatPrice(selectedOrder.promo_discount)}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', padding: '16px', fontSize: '18px', fontWeight: 'bold' }}>TỔNG CỘNG:</td>
                  <td style={{ textAlign: 'right', padding: '16px', fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>{formatPrice(selectedOrder.total_price)}</td>
                </tr>
              </tfoot>
            </table>

          </div>
        </div>
      )}
    </div>
  );
}
