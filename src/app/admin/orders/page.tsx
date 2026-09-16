'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrders, updateOrderStatus, isSupabaseConfigured, Order, OrderStatus } from '@/lib/api';
import { Package, Truck, CheckCircle, Clock, XCircle, Search, ChevronDown, RefreshCw, AlertCircle, Loader2, Eye, X, User, MapPin } from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={13} /> },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: <Package size={13} /> },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: <Truck size={13} /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={13} /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle size={13} /> },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const supabaseReady = isSupabaseConfigured();

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.product_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    // Optimistic UI update
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const result = await updateOrderStatus(id, status);
    if (result.error) {
      // Revert if error
      await loadOrders();
    }
    setUpdatingId(null);
  };

  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'bg-blue-500', icon: <Package size={22} /> },
    { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length, color: 'bg-yellow-500', icon: <Clock size={22} /> },
    { label: 'Shipped', value: orders.filter((o) => o.status === 'shipped').length, color: 'bg-purple-500', icon: <Truck size={22} /> },
    { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, color: 'bg-green-500', icon: <CheckCircle size={22} /> },
  ];

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      {/* Supabase warning */}
      {!supabaseReady && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Read-only mode:</strong> Displaying sample orders. Status changes won't be persisted without Supabase configuration.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg text-white ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              {isLoading ? (
                <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Revenue (excl. cancelled)</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 text-gray-500 border border-gray-200 font-bold px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
            className="outline-none text-sm bg-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex items-center justify-center gap-3 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-medium">Loading orders...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Order ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Update</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.city}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                      {order.product_description}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-800">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig[order.status].color}`}
                      >
                        {statusConfig[order.status].icon}
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value as OrderStatus)
                          }
                          disabled={updatingId === order.id}
                          className="text-xs border border-gray-200 rounded px-2 py-1.5 outline-none bg-white cursor-pointer disabled:opacity-60"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {updatingId === order.id && (
                          <Loader2
                            size={12}
                            className="animate-spin absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-brand-light text-brand-primary hover:bg-brand-accent transition-colors shadow-sm border border-brand-border"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <p className="font-medium">No orders found.</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden border border-brand-border relative animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 px-6 flex items-center justify-between z-10 shadow-sm">
              <div>
                <h2 className="text-xl font-serif font-bold text-brand-primary">Order Details</h2>
                <p className="text-xs text-gray-500 font-mono mt-1">{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="font-semibold text-gray-800">{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${statusConfig[selectedOrder.status].color}`}>
                    {statusConfig[selectedOrder.status].icon}
                    {statusConfig[selectedOrder.status].label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Customer Info */}
                <div className="bg-brand-light/50 rounded-xl p-5 border border-brand-border">
                  <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={16} className="text-brand-accent" /> Customer Info
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-brand-muted text-xs mb-1">Name</p>
                      <p className="font-medium text-gray-800">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted text-xs mb-1">Email</p>
                      <a href={`mailto:${selectedOrder.email}`} className="font-medium text-brand-secondary hover:underline break-all">{selectedOrder.email}</a>
                    </div>
                    {selectedOrder.phone && (
                      <div>
                        <p className="text-brand-muted text-xs mb-1">Phone</p>
                        <a href={`tel:${selectedOrder.phone}`} className="font-medium text-gray-800 hover:underline">{selectedOrder.phone}</a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-brand-light/50 rounded-xl p-5 border border-brand-border">
                  <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-accent" /> Shipping Address
                  </h3>
                  <div className="space-y-4 text-sm">
                    {selectedOrder.address ? (
                      <div>
                        <p className="text-brand-muted text-xs mb-1">Street Address</p>
                        <p className="font-medium text-gray-800">{selectedOrder.address}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No address provided</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {selectedOrder.city && (
                        <div>
                          <p className="text-brand-muted text-xs mb-1">City</p>
                          <p className="font-medium text-gray-800">{selectedOrder.city}</p>
                        </div>
                      )}
                      {selectedOrder.state && (
                        <div>
                          <p className="text-brand-muted text-xs mb-1">State</p>
                          <p className="font-medium text-gray-800">{selectedOrder.state}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {selectedOrder.pincode && (
                        <div>
                          <p className="text-brand-muted text-xs mb-1">PIN / ZIP</p>
                          <p className="font-medium text-gray-800">{selectedOrder.pincode}</p>
                        </div>
                      )}
                      {selectedOrder.country && (
                        <div>
                          <p className="text-brand-muted text-xs mb-1">Country</p>
                          <p className="font-medium text-gray-800">{selectedOrder.country}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-brand-light/50 rounded-xl p-5 border border-brand-border mb-8">
                <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Package size={16} className="text-brand-accent" /> Products Ordered
                </h3>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed font-medium">
                    {selectedOrder.product_description}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-brand-primary text-white rounded-xl p-6 shadow-lg">
                <div>
                  <p className="text-brand-light/70 text-xs mb-1 uppercase tracking-wider font-bold">Payment Method</p>
                  <p className="font-medium capitalize text-brand-accent">{selectedOrder.payment_method || 'UPI / Online'}</p>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="text-brand-light/70 text-xs mb-1 uppercase tracking-wider font-bold">Total Amount</p>
                  <p className="text-3xl font-serif font-bold text-white">₹{selectedOrder.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
