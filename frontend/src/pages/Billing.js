import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import ReactToPrint from "react-to-print";

const Billing = () => {
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenu(res.data);
      } catch (err) {
        console.error("Error fetching menu", err);
      }
    };
    fetchMenu();
  }, []);

  const handleSelectItem = (item) => {
    const index = selectedItems.findIndex((i) => i._id === item._id);
    if (index >= 0) {
      const newItems = [...selectedItems];
      newItems[index].qty++;
      setSelectedItems(newItems);
    } else {
      setSelectedItems([...selectedItems, { ...item, qty: 1 }]);
    }
  };

  const handleQtyChange = (id, delta) => {
    const updated = selectedItems
      .map((item) =>
        item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
      .filter((item) => item.qty > 0);
    setSelectedItems(updated);
  };

  const total = selectedItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const handlePrint = async () => {
    try {
      await api.post("/bills", {
        customerName,
        items: selectedItems,
        total,
      });
      setSelectedItems([]);
      setCustomerName("");
    } catch (err) {
      console.error("Failed to save bill", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Billing Page</h2>

      <input
        type="text"
        placeholder="Enter Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        {menu.map((item) => (
          <div key={item._id} className="border p-2 flex justify-between">
            <span>{item.name} - ₹{item.price}</span>
            <button
              onClick={() => handleSelectItem(item)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      <div ref={printRef} className="border p-4 mb-4">
        <h3 className="font-semibold mb-2">Bill Preview</h3>
        {selectedItems.length === 0 ? (
          <p>No items selected</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>
                    <button onClick={() => handleQtyChange(item._id, -1)}>-</button>
                    <span className="mx-2">{item.qty}</span>
                    <button onClick={() => handleQtyChange(item._id, 1)}>+</button>
                  </td>
                  <td>₹{item.price}</td>
                  <td>₹{item.qty * item.price}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-right font-bold">Total</td>
                <td className="font-bold">₹{total}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-4">
        <ReactToPrint
          trigger={() => (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              disabled={!customerName || selectedItems.length === 0}
            >
              Print Bill
            </button>
          )}
          content={() => printRef.current}
          onAfterPrint={handlePrint}
        />
      </div>
    </div>
  );
};

export default Billing;
