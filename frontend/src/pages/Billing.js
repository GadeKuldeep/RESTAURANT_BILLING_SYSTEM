import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { utils, writeFileXLSX } from 'xlsx';
import "./Billing.css";

const Billing = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [showBill, setShowBill] = useState(false);
  const billRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/menu', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setMenuItems(res.data);
        const initialQty = {};
        res.data.forEach(item => (initialQty[item._id] = 0));
        setQuantities(initialQty);
      })
      .catch(err => console.error('Error fetching menu:', err));
  }, []);

  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(prev[id] + delta, 0)
    }));
  };

  const handleClearAll = () => {
    const clearedQuantities = {};
    menuItems.forEach(item => {
      clearedQuantities[item._id] = 0;
    });
    setQuantities(clearedQuantities);
    setCustomerName('');
    setShowBill(false);
  };

  const totalAmount = menuItems.reduce((acc, item) => {
    return acc + (item.price * (quantities[item._id] || 0));
  }, 0);

  const filteredItems = menuItems.filter(item => quantities[item._id] > 0);

  const handleSaveToExcel = () => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const time = now.toLocaleString();

    const minimalData = [{
      "Customer Name": customerName || "N/A",
      "Total Amount": totalAmount,
      "Date & Time": time
    }];

    const ws = utils.json_to_sheet(minimalData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Bill");

    const fileName = `${formattedDate}.xlsx`;
    writeFileXLSX(wb, fileName);  // Triggers download
  };

  const handleCreateBill = () => {
    setShowBill(true);
    setTimeout(() => {
      handleSaveToExcel();
      window.print();
    }, 500);
  };

  return (
    <div className="billing-page">
      <div className="billing-container">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="billing-card">
          <h1 className="billing-title">Restaurant Billing</h1>

          <div className="customer-name-input">
            <label className="customer-label">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="customer-input"
              placeholder="Enter customer name"
            />
          </div>

          <div className="menu-list">
            {menuItems.map((item) => (
              <div key={item._id} className="menu-item">
                <div className="item-name">{item.name}</div>
                <div className="item-price">₹{item.price}</div>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item._id, -1)} className="qty-btn minus">−</button>
                  <span className="qty-value">{quantities[item._id]}</span>
                  <button onClick={() => handleQuantityChange(item._id, 1)} className="qty-btn plus">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="total-amount">Total: ₹{totalAmount}</div>

          <div className="create-bill-button">
            <button onClick={handleCreateBill} className="create-btn">Create Bill</button>
            <button onClick={handleClearAll} className="clear-btn" style={{ marginLeft: '1rem' }}>Clear All</button>
          </div>
        </div>

        {showBill && (
          <div className="bill-overlay">
            <div className="bill-popup" ref={billRef}>
              <h2 className="bill-heading">🍽️___Suvarn___ Bill</h2>
              <div className="bill-details">
                <div>Customer: <span className="bold">{customerName || "N/A"}</span></div>
                <div>Date: {new Date().toLocaleString()}</div>
              </div>
              {filteredItems.map((item, i) => (
                <div key={i} className="bill-item">
                  <div>{item.name}</div>
                  <div>₹{item.price} × {quantities[item._id]}</div>
                </div>
              ))}
              <div className="bill-total">Total: ₹{totalAmount}</div>
              <div className="thank-you-msg">Thank you! 🙏</div>

              <button onClick={() => setShowBill(false)} className="close-btn">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
