import React, { useState } from "react";
import { addStock, checkStock } from "../services/api";

function Dashboard() {
  const [productId, setProductId] = useState("");
  const [stock, setStock] = useState("");

  const handleAddStock = async () => {
    try {
      await addStock({ product_id: productId, stock: Number(stock) });
      alert("Stock added");
    } catch {
      alert("Failed to add stock");
    }
  };

  const handleCheckStock = async () => {
    try {
      const res = await checkStock(productId);
      alert(`Available stock: ${res.data.available_stock}`);
    } catch {
      alert("Error checking stock");
    }
  };

  return (
    <div>
      <h2>Inventory Dashboard</h2>

      <input
        placeholder="Product ID"
        onChange={(e) => setProductId(e.target.value)}
      />

      <input
        type="number"
        placeholder="Stock"
        onChange={(e) => setStock(e.target.value)}
      />

      <br /><br />

      <button onClick={handleAddStock}>Add Stock</button>
      <button onClick={handleCheckStock}>Check Stock</button>
    </div>
  );
}

export default Dashboard;
