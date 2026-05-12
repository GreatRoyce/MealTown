import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../utils/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  // Status options including "All"
  const statusOptions = ["All", "Preparing", "On the way", "Delivered", "Cancelled"];

  // Status colors map
  const statusStyles = {
    Preparing: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    Delivered: "bg-green-100 text-green-800 border border-green-200",
    "On the way": "bg-blue-100 text-blue-800 border border-blue-200",
    Cancelled: "bg-red-100 text-red-800 border border-red-200",
    Pending: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  // Format price properly
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders();
        setOrders(response?.data || []);
      } catch (err) {
        setError(err?.message || "Failed to load orders. Please try again.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders by status
  const filteredOrders = filterStatus === "All" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Handle order click
  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Get order items count
  const getItemsCount = (order) => {
    if (order.items && Array.isArray(order.items)) {
      return order.items.length;
    }
    return 1; // Default to 1 if items array not available
  };

  // Get total price with delivery fee
  const getTotalPrice = (order) => {
    const subtotal = order.price || 0;
    const deliveryFee = order.deliveryFee || 2.99; // Default delivery fee
    return subtotal + deliveryFee;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage all your food orders</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filterStatus === status
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
            {status !== "All" && (
              <span className="ml-2 bg-white bg-opacity-20 text-xs px-1.5 py-0.5 rounded-full">
                {orders.filter(order => order.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {filterStatus === "All" 
              ? "You haven't placed any orders yet." 
              : `You don't have any ${filterStatus.toLowerCase()} orders.`}
          </p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id || order._id}
              onClick={() => handleOrderClick(order.id || order._id)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
            >
              <div className="p-5 md:p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        #{order.orderNumber || `ORD-${(order.id || order._id).slice(-6).toUpperCase()}`}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.restaurant || "Restaurant"}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(getTotalPrice(order))}
                  </p>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(order.date || order.createdAt || new Date().toISOString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Items</p>
                    <p className="text-gray-900 font-medium">
                      {getItemsCount(order)} item{getItemsCount(order) !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                  <p className="text-gray-900">
                    {order.deliveryAddress || "Address not specified"}
                  </p>
                </div>

                {/* Order Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/track-order", { state: { orderId: order.id || order._id } });
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    Track Order
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle reorder logic
                      console.log("Reorder:", order.id || order._id);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Reorder
                  </button>
                  {order.status === "Delivered" && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/review/${order.restaurantId || order.vendorId}`);
                      }}
                      className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
                    >
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(orders.reduce((total, order) => total + (order.price || 0), 0))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Delivered Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {orders.filter(order => order.status === "Delivered").length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
