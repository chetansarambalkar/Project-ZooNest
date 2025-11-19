import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AdminDashboard.css";

const ViewTickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch all bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/bookings")
      .then((response) => {
        console.log("Bookings data:", response.data); // Debugging
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again.");
        setLoading(false);
      });
  };

  // ✅ Cancel Booking
  const cancelBooking = (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    axios
      .delete(`http://localhost:5000/delete-booking/${id}`)
      .then(() => {
        alert("Booking canceled successfully!");
        fetchBookings(); // Refresh bookings list
      })
      .catch((error) => {
        console.error("Error deleting booking:", error);
        alert("Failed to cancel booking.");
      });
  };

  return (
    <div className="view-tickets">
      <h2>Booked Tickets</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Student</th>
              <th>Child</th>
              <th>Foreigner</th>
              <th>Regular</th>
              <th>Total Tickets</th>
              <th>Total Price (₹)</th>
              <th>Visit Date</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.name || "N/A"}</td>
                <td>{booking.email || "N/A"}</td>
                <td>{booking.phone || "N/A"}</td>
                <td>{booking.student ?? 0}</td>
                <td>{booking.child ?? 0}</td>
                <td>{booking.foreigner ?? 0}</td>
                <td>{booking.regular ?? 0}</td>
                <td>
                  {(booking.student ?? 0) +
                    (booking.child ?? 0) +
                    (booking.foreigner ?? 0) +
                    (booking.regular ?? 0)}
                </td>
                <td>₹{booking.total_price ?? 0}</td>
                <td>{new Date(booking.visit_date).toLocaleDateString()}</td>

                {/* ✅ Payment Status Column */}
                <td>
                  <span
                    className={
                      booking.payment_status === "PAID" ? "paid-status" : "pending-status"
                    }
                  >
                    {booking.payment_status === "PAID" ? "✅ PAID" : "❌ PENDING"}
                  </span>
                </td>

                <td>
                  <button
                    className="cancel-btn"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    ❌ Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings found</p>
      )}
    </div>
  );
};

export default ViewTickets;
