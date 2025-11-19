import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Booking.css'

const Booking = () => {
  const navigate = useNavigate();

  const [ticketRates] = useState({
    student: 100,
    child: 50,
    foreigner: 500,
    regular: 200,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    student: 0,
    child: 0,
    foreigner: 0,
    regular: 0,
    visit_date: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});

  // ✅ Calculate total price dynamically
  const calculateTotalPrice = (updatedData) => {
    return (
      updatedData.student * ticketRates.student +
      updatedData.child * ticketRates.child +
      updatedData.foreigner * ticketRates.foreigner +
      updatedData.regular * ticketRates.regular
    ).toFixed(2);
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "name") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, ""); // ✅ Allow only letters & spaces
    } else if (["student", "child", "foreigner", "regular"].includes(name)) {
      updatedValue = Math.min(20, Math.max(0, parseInt(value, 10) || 0)); // ✅ Limit 0-20 tickets
    }

    const updatedData = { ...formData, [name]: updatedValue };
    setFormData(updatedData);
    setTotalPrice(calculateTotalPrice(updatedData));

    // Clear validation errors
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const today = new Date().toISOString().split("T")[0];

    if (!formData.name) newErrors.name = "Name is required";
    if (!/^[a-zA-Z\s]+$/.test(formData.name))
      newErrors.name = "Name must contain only letters";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.visit_date) newErrors.visit_date = "Please select a visit date";
    if (formData.visit_date && formData.visit_date <= today)
      newErrors.visit_date = "Please select a future date";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    // Ensure at least one ticket is booked
    const totalTickets =
      formData.student + formData.child + formData.foreigner + formData.regular;
    if (totalTickets === 0)
      newErrors.tickets = "You must book at least one ticket";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ Show Confirmation Popup
    const isConfirmed = window.confirm(
      `Do you want to continue?\nTotal Price: ₹${totalPrice}`
    );

    if (!isConfirmed) return;

    // ✅ Prepare data to send to the database
    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      visit_date: formData.visit_date,
      student: formData.student,
      child: formData.child,
      foreigner: formData.foreigner,
      regular: formData.regular,
      total_price: totalPrice,
    };

    try {
      const response = await axios.post("http://localhost:5000/book-tickets", bookingData);
      
      if (response.data && response.data.bookingId) {
        // ✅ Navigate to BookingDetails.js with the booking ID
        navigate("/booking-details", { state: { ...bookingData, id: response.data.bookingId } });
      } else {
        throw new Error("Booking ID not received");
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      alert("Booking failed. Please try again later.");
    }
  };

  return (
    <div className="booking-container">
      {/* ✅ Ticket Rates Table */}
      <div className="ticket-rates">
        <h2>Ticket Prices</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(ticketRates).map(([category, price], index) => (
              <tr key={index}>
                <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>₹{price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Booking Form */}
      <div className="booking-form">
        <h2>Book Your Tickets</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}

          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}

          <input type="text" name="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleChange} />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <label>Select Visit Date</label>
          <input type="date" name="visit_date" value={formData.visit_date} onChange={handleChange} />
          {errors.visit_date && <p className="error">{errors.visit_date}</p>}

          <label>Tickets Type:</label>
          {["student", "child", "foreigner", "regular"].map((category) => (
            <div key={category}>
              <label>{category.charAt(0).toUpperCase() + category.slice(1)} Tickets</label>
              <input type="number" name={category} value={formData[category]} onChange={handleChange} />
            </div>
          ))}
          {errors.tickets && <p className="error">{errors.tickets}</p>}

          <h3>Total Price: ₹{totalPrice}</h3>
          <button type="submit" className="book-btn">Book Now</button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
