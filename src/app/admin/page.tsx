'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProducts, getOrders, isSupabaseConfigured, Order } from '@/lib/api';
import { Product } from '@/data/products';
import { Package, DollarSign, TrendingUp, Users, Loader2, RefreshCw, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock size={12} />,
  processing: <Package size={12} />,
  shipped: <Truck size={12} />,
  delivered: <CheckCircle size={12} />,
  cancelled: <XCircle size={12} />,
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabaseReady = isSupabaseConfigured();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [productData, orderData] = await Promise.all([getProducts(), getOrders()]);
    setProducts(productData);
    setOrders(orderData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.amount, 0);

  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped'
  ).length;

  const uniqueCustomers = new Set(orders.map((o) => o.email)).size;

  const stats = [
    {
      name: 'Total Products',
      value: products.length.toString(),
      icon: <Package size={24} />,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Revenue',
      value: `₹ ${totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={24} />,
      color: 'bg-green-500',
    },
    {
      name: 'Active Orders',
      value: activeOrders.toString(),
      icon: <TrendingUp size={24} />,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Customers',
      value: uniqueCustomers.toString(),
      icon: <Users size={24} />,
      color: 'bg-orange-500',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4"
          >
            <div className={`p-3 rounded-lg text-white ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick order stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <div key={status} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${statusColors[status]}`}
              >
                {statusIcons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {isLoading ? (
                <div className="h-7 w-8 bg-gray-200 animate-pulse rounded mt-2 mx-auto" />
              ) : (
                <p className="text-2xl font-bold text-gray-800 mt-2">{count}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Order
                  </th>
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-mono text-xs text-gray-500">{order.id}</td>
                    <td className="py-3">
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.city}</p>
                    </td>
                    <td className="py-3 font-bold text-gray-800">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}
                      >
                        {statusIcons[order.status]}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Supabase status indicator */}
        {!supabaseReady && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Supabase Setup Required:</strong> You are viewing sample data. Configure{' '}
              <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
              <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{' '}
              <code className="bg-yellow-100 px-1 rounded">.env.local</code> and run the SQL migrations
              in your Supabase project to enable full dynamic functionality.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
