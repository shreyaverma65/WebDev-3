
import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    quantity: "",
    reorderLevel: "",
    supplier: ""
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add product
  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
          reorderLevel: Number(form.reorderLevel)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not add product");
        return;
      }

      alert("Product added successfully!");
      setForm({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
        reorderLevel: "",
        supplier: ""
      });

      fetchProducts();
    } catch (error) {
      alert("Server connection failed");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      alert("Server connection failed");
    }
  };

  // Update quantity
  const updateQuantity = async (product) => {
    const quantity = prompt(
      "Enter new quantity:",
      product.quantity
    );

    if (quantity === null || quantity.trim() === "") return;

    if (!Number.isFinite(Number(quantity)) || Number(quantity) < 0) {
      alert("Enter a valid quantity");
      return;
    }

    try {
      const response = await fetch(`${API}/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quantity: Number(quantity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Quantity updated!");
      fetchProducts();
    } catch (error) {
      alert("Server connection failed");
    }
  };

  const lowStock = products.filter(
    (p) => p.quantity <= p.reorderLevel
  ).length;

  return (
    <div className="app">
      <header>
        <h1>📦 Inventory Management System</h1>
        <p>Manage and monitor your inventory efficiently</p>
      </header>

      <main>
        <section className="stats">
          <div className="stat-card">
            <h3>Total Products</h3>
            <h2>{products.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Total Stock</h3>
            <h2>
              {products.reduce(
                (sum, p) => sum + p.quantity,
                0
              )}
            </h2>
          </div>

          <div className="stat-card">
            <h3>Low Stock Items</h3>
            <h2>{lowStock}</h2>
          </div>
        </section>

        <section className="form-section">
          <h2>Add New Product</h2>

          <form onSubmit={addProduct}>
            <input name="name" placeholder="Product Name"
              value={form.name} onChange={handleChange} required />

            <input name="sku" placeholder="SKU"
              value={form.sku} onChange={handleChange} required />

            <input name="category" placeholder="Category"
              value={form.category} onChange={handleChange} required />

            <input name="price" type="number" placeholder="Price"
              value={form.price} onChange={handleChange} required />

            <input name="quantity" type="number" placeholder="Quantity"
              value={form.quantity} onChange={handleChange} required />

            <input name="reorderLevel" type="number" placeholder="Reorder Level"
              value={form.reorderLevel} onChange={handleChange} required />

            <input name="supplier" placeholder="Supplier"
              value={form.supplier} onChange={handleChange} required />

            <button type="submit">Add Product</button>
          </form>
        </section>

        <section className="table-section">
          <div className="table-heading">
            <h2>Product Inventory</h2>
            <button onClick={fetchProducts}>Refresh</button>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.supplier}</td>

                      <td>
                        <span className={
                          product.quantity <= product.reorderLevel
                            ? "low-stock"
                            : "in-stock"
                        }>
                          {product.quantity <= product.reorderLevel
                            ? "Low Stock"
                            : "In Stock"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => updateQuantity(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td colSpan="8">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
