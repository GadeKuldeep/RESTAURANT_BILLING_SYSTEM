import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

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

  const handleBack = () => {
    navigate("/"); // Change "/" to your desired main page route if different
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <button onClick={handleBack} className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg></button>

      <div className="add-form">
        <input
          type="text"
          placeholder="Dish Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) =>
            setNewItem({ ...newItem, price: parseFloat(e.target.value) })
          }
          className="input-field"
        />
        <button onClick={handleAdd} className="add-button">Add Item</button>
      </div>

      <table className="menu-table">
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
                <button
                  onClick={() => handleDelete(item._id)}
                  className="delete-button"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate("/billing")} className="billing-button">
        Go to Billing Page →
      </button>
    </div>
  );
};

export default Dashboard;
