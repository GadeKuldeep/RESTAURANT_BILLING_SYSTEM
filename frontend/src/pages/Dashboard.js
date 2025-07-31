import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: 0 });
  const navigate = useNavigate();

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenu(res.data);
    } catch (err) {
      console.error("Error fetching menu", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAdd = async () => {
    if (!newItem.name || newItem.price <= 0) return;
    try {
      await api.post("/menu", newItem);
      setNewItem({ name: "", price: 0 });
      fetchMenu();
    } catch (err) {
      console.error("Error adding item", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error("Error deleting item", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <button onClick={handleLogout} style={styles.logout}>Logout</button>
      
      <div style={styles.addForm}>
        <input
          type="text"
          placeholder="Dish Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
          style={styles.input}
        />
        <button onClick={handleAdd} style={styles.addButton}>Add Item</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Dish</th>
            <th>Price</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>
                <button onClick={() => handleDelete(item._id)} style={styles.deleteButton}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate("/billing")} style={styles.billingButton}>
        Go to Billing Page →
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "2rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  addForm: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  input: {
    padding: "10px",
    flex: 1,
  },
  addButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  billingButton: {
    marginTop: "1.5rem",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  logout: {
    float: "right",
    padding: "8px 12px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Dashboard;
