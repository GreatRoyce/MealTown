import React, { useEffect, useMemo, useState } from "react";
import { getUserCart } from "../utils/api";

function Cart({ onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Close on ANY key press
  useEffect(() => {
    const handleKeyDown = () => {
      onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!localStorage.getItem("token")) {
        setError("Please login to view your cart.");
        setLoading(false);
        return;
      }

      try {
        const response = await getUserCart();
        setCart(response?.data || null);
      } catch (err) {
        if (err?.message === "No cart found for this user") {
          setCart(null);
        } else {
          setError(err?.message || "Failed to load cart");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const cartItems = useMemo(() => cart?.cartedItems || [], [cart]);
  const cartTotal = useMemo(() => cart?.totalPrice || 0, [cart]);

  // Close when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.id === "cart-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="cart-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-[400px] rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <i className="fa-solid fa-cart-shopping"></i>
          Your Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review your selected items and proceed to checkout when ready.
        </p>

        {loading ? (
          <div className="py-10 text-center text-gray-600">Loading cart...</div>
        ) : error ? (
          <div className="py-8">
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <i className="fa-solid fa-bag-shopping text-6xl text-gray-400 mb-4"></i>
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <button
              onClick={onClose}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => (
                <div
                  key={String(item._id || item.itemId?._id || item.itemId)}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  <p className="font-medium text-gray-900">
                    {item.itemId?.name || "Item"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity || 1}
                  </p>
                  <p className="text-sm text-gray-700">
                    Subtotal: ${(item.totalItemPrice || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <p className="font-semibold text-gray-700">Total</p>
              <p className="text-lg font-bold text-gray-900">${cartTotal.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
