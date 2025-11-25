"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DollarSign, ShoppingBag, Truck, Loader2, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // 1. SECURITY CHECK
  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") redirect("/");
  }, [status, session]);

  // 2. DATA FETCHING
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "admin") fetchOrders();
  }, [session]);

  // 3. STATUS UPDATE LOGIC
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Loading State
  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  // Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-off-white p-4 md:p-12">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="font-oswald text-4xl font-bold uppercase mb-2">Admin Dashboard</h1>
            <p className="text-lg text-concrete">Overview for {session.user.name}</p>
        </div>
        <div className="text-right">
            <span className="block text-xs text-concrete uppercase tracking-widest font-bold">Security Level</span>
            <span className="inline-block bg-black text-white text-xs font-bold px-2 py-1 rounded">ADMINISTRATOR</span>
        </div>
      </div>
      
      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-electric-blue">
          <DollarSign className="w-6 h-6 text-electric-blue mb-2" />
          <h3 className="text-3xl font-bold font-oswald mb-1">${totalRevenue.toLocaleString()}</h3>
          <p className="text-concrete text-sm">Total Revenue</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
          <ShoppingBag className="w-6 h-6 text-yellow-500 mb-2" />
          <h3 className="text-3xl font-bold font-oswald mb-1">{pendingOrders}</h3>
          <p className="text-concrete text-sm">Pending Orders</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <Truck className="w-6 h-6 text-green-500 mb-2" />
          <h3 className="text-3xl font-bold font-oswald mb-1">{orders.length}</h3>
          <p className="text-concrete text-sm">Total Orders</p>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-oswald text-2xl font-bold uppercase">Recent Orders</h2>
          <button onClick={fetchOrders} className="text-sm font-bold text-concrete hover:text-black flex items-center gap-2 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh Data
          </button>
        </div>
        
        {orders.length === 0 ? (
            <p className="text-center py-8 text-concrete">No orders found.</p>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-concrete uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-concrete uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-concrete uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-concrete uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-concrete uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-concrete">{order._id.slice(-6)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{order.shippingAddress?.name || "Guest"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-bold">${order.totalAmount}</td>
                      
                      {/* Status Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          {updatingId === order._id ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-concrete" />
                                <span className="text-xs text-concrete">Updating...</span>
                            </div>
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-bold uppercase cursor-pointer focus:outline-none border-none ring-1 ring-inset ring-black/10 ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Paid">Paid</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-concrete">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="font-oswald text-2xl font-bold mb-4 uppercase">Quick Actions</h2>
        <div className="flex gap-4">
            <Link href="/admin/add">
              <button className="bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-electric-blue transition-all shadow-lg flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  Add New Product
              </button>
            </Link>
            
            <button className="bg-white text-black border border-neutral-200 px-6 py-4 rounded-xl font-bold hover:bg-neutral-50 transition-colors flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Manage Inventory
            </button>
        </div>
      </div>

    </div>
  );
}
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // 1. Check Status Code BEFORE reading JSON
      if (!res.ok) {
        const errorText = await res.text(); // Read as text first
        console.error("Server Error:", errorText);
        alert(`Failed: Server responded with ${res.status} ${res.statusText}`);
        return;
      }

      // 2. Only parse JSON if response is OK
      const data = await res.json();
      setSuccess(true);
      setTimeout(() => router.push("/admin"), 2000);

    } catch (error) {
      console.error("Client Error:", error);
      alert("Network error. Check console.");
    } finally {
      setLoading(false);
    }
  };