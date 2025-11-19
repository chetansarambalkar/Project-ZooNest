import React, { useState, useEffect } from "react";
import axios from "axios";

const AddRates = ({ onRateUpdated }) => {
  const [newRate, setNewRate] = useState({ category: "", price: "" });
  const [ticketRates, setTicketRates] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketRates();
  }, []);

  // ✅ Fetch ticket rates from the database
  const fetchTicketRates = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/ticket-rates")
      .then(response => {
        setTicketRates(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching ticket rates:", error);
        setMessage("❌ Failed to load ticket rates. Try again.");
        setLoading(false);
      });
  };

  // ✅ Handle input changes
  const handleNewRateChange = (e) => {
    setNewRate({ ...newRate, [e.target.name]: e.target.value });
  };

  // ✅ Add new ticket rate
  const addTicketRate = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/add-ticket-rate", newRate)
      .then(() => {
        setMessage("✅ Ticket rate added successfully!");
        fetchTicketRates(); // Refresh the table
        onRateUpdated(); // Update Booking.js dynamically
        setNewRate({ category: "", price: "" });

        setTimeout(() => setMessage(""), 3000); // Hide message after 3s
      })
      .catch(error => setMessage(error.response?.data?.error || " adding ticket rate successfully"));
  };

  // ✅ Delete a ticket rate
  const deleteTicketRate = (id) => {
    if (!window.confirm("Are you sure you want to delete this rate?")) return;

    axios.delete(`http://localhost:5000/api/delete-ticket-rate/${id}`)
      .then(() => {
        setMessage("🗑️ Ticket rate deleted successfully!");
        fetchTicketRates();
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(error => setMessage("❌ Error deleting ticket rate"));
  };

  return (
    <div className="add-rates">
      <h3>Manage Ticket Rates</h3>
      {message && <p className="message">{message}</p>}

      {/* ✅ Display Existing Rates */}
      {loading ? <p>Loading ticket rates...</p> : (
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ticketRates.length > 0 ? (
              ticketRates.map((rate) => (
                <tr key={rate.id}>
                  <td>{rate.category}</td>
                  <td>₹{rate.price}</td>
                  <td>
                    <button onClick={() => deleteTicketRate(rate.id)} className="delete-btn">🗑️ Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No ticket rates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ✅ Add New Rate Form */}
      <form onSubmit={addTicketRate}>
        <input type="text" name="category" placeholder="Category Name" value={newRate.category} onChange={handleNewRateChange} required />
        <input type="number" name="price" placeholder="Price (₹)" value={newRate.price} onChange={handleNewRateChange} required />
        <button type="submit">Add Rate</button>
      </form>
    </div>
  );
};

export default AddRates;
