import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProducts,
  addToCart,
  getCart,
  removeCartItem,
  clearCart,
  createOrderFromCart,
  getOrders,
} from "../services/api";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data || []);
  };

  const fetchCart = async () => {
    const res = await getCart();
    setCart(res.data || []);
  };

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data || []);
  };

  const handleAddToCart = async (product) => {
  await addToCart({ product_id: product.id, quantity: 1 });
  setMessage("Added to cart");

  await fetchCart();
  await fetchProducts(); // 🔥 keeps UI consistent
};


  const handleRemoveCartItem = async (item) => {
    await removeCartItem({ product_id: item.product_id });
    fetchCart();
  };

  const handleClearCart = async () => {
    await clearCart();
    fetchCart();
  };

  const handleCreateOrder = async () => {
  try {
    setOrdering(true);
    setMessage(null);

    await createOrderFromCart();

    setMessage("Order created successfully ✅");

    await fetchCart();
    await fetchOrders();
    await fetchProducts(); // 🔥 ADD THIS → updates stock
  } catch {
    setMessage("Failed to create order ❌");
  } finally {
    setOrdering(false);
  }
};


  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) return total;
    return total + product.price * item.quantity;
  }, 0);

  /* 🔥 Animation variants */
  const tabVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        {message && <div className="alert alert-info">{message}</div>}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "products" ? "active" : ""
              }`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "cart" ? "active" : ""
              }`}
              onClick={() => setActiveTab("cart")}
            >
              Cart
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "orders" ? "active" : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
          </li>
        </ul>

        {/* 🔥 Animated Tab Content */}
        <AnimatePresence mode="wait">
          {/* PRODUCTS */}
          {activeTab === "products" && (
            <motion.div
              key="products"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <div className="row">
                {products.map((p) => (
                  <div key={p.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{p.name}</h5>

                        <p className="card-text mb-2">
                          <strong>₹ {p.price}</strong>
                        </p>

                        <span
                          className={`badge mb-3 ${
                            p.stock > 0 ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {p.stock > 0
                            ? `In Stock: ${p.stock}`
                            : "Out of Stock"}
                        </span>

                        <button
                          className="btn btn-primary mt-auto"
                          disabled={p.stock === 0}
                          onClick={() => handleAddToCart(p)}
                        >
                          {p.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CART */}
          {activeTab === "cart" && (
            <motion.div
              key="cart"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const product = products.find(
                      (p) => p.id === item.product_id
                    );

                    return (
                      <tr key={item.product_id}>
                        <td>{product?.name || item.product_id}</td>
                        <td>₹ {product?.price || "-"}</td>
                        <td>{item.quantity}</td>
                        <td>
                          ₹{" "}
                          {product
                            ? product.price * item.quantity
                            : "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleRemoveCartItem(item)
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <h5 className="text-end me-2">
                Total: <strong>₹ {cartTotal}</strong>
              </h5>

              <button
                className="btn btn-success"
                onClick={handleCreateOrder}
                disabled={cart.length === 0 || ordering}
              >
                {ordering ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Placing order...
                  </>
                ) : (
                  "Create Order from Cart"
                )}
              </button>

              <button
                className="btn btn-secondary ms-2"
                onClick={handleClearCart}
                disabled={cart.length === 0 || ordering}
              >
                Clear Cart
              </button>
            </motion.div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>₹ {o.total_price}</td>
                      <td>{o.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Dashboard;
