import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import "../Booking-Details-Container.css"; 

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};

  const [isPaid, setIsPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [ticketLimitReached, setTicketLimitReached] = useState(false);

  // Check payment status when booking data is loaded
  useEffect(() => {
    if (!bookingData.id) return;

    const fetchPaymentStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-payment-status/${bookingData.id}`);
        setIsPaid(response.data.payment_status === "PAID");
      } catch (error) {
        console.error("❌ Error fetching payment status:", error.response?.data || error.message);
      }
    };

    fetchPaymentStatus();
  }, [bookingData.id]);

  // Check total tickets booked for the visit date
  useEffect(() => {
    if (!bookingData.visit_date) return;

    const checkTicketLimit = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tickets-count/${bookingData.visit_date}`);
        const totalTicketsBooked = response.data.total || 0;

        if (totalTicketsBooked >= 100) {
          setTicketLimitReached(true);
          alert("⚠ Ticket limit for this date has been reached (100). Please choose another date.");
        }
      } catch (error) {
        console.error("❌ Error fetching ticket count:", error.response?.data || error.message);
      }
    };

    checkTicketLimit();
  }, [bookingData.visit_date]);

  // Handle Payment Process
  const handlePayment = async () => {
    if (!bookingData.id) {
      alert("❌ Error: Booking ID is missing. Cannot proceed with payment.");
      return;
    }

    if (!window.confirm("Do you want to proceed with the payment?")) return;

    setLoadingPayment(true);

    try {
      const response = await axios.put(`http://localhost:5000/update-payment/${bookingData.id}`, { status: "PAID" });

      console.log("✅ Payment Update Response:", response.data);

      if (response.data.payment_status === "PAID") {
        alert("✅ Payment Successful! Thank you for booking.");
        setIsPaid(true);
      } else {
        alert("❌ Payment update failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error updating payment status:", error.response?.data || error.message);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  // Generate and Download Bill
  const handleDownloadBill = () => {
    if (!isPaid) {
      alert("⚠ Please complete the payment before downloading the bill.");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("🐯 Zoo Ticket Booking Receipt", 20, 20);

      doc.setFontSize(12);
      doc.text(`Name: ${bookingData.name || "N/A"}`, 20, 40);
      doc.text(`Email: ${bookingData.email || "N/A"}`, 20, 50);
      doc.text(`Phone: ${bookingData.phone || "N/A"}`, 20, 60);
      doc.text(`Visit Date: ${bookingData.visit_date || "N/A"}`, 20, 70);
      doc.text(`Student Tickets: ${bookingData.student || 0}`, 20, 80);
      doc.text(`Child Tickets: ${bookingData.child || 0}`, 20, 90);
      doc.text(`Foreigner Tickets: ${bookingData.foreigner || 0}`, 20, 100);
      doc.text(`Regular Tickets: ${bookingData.regular || 0}`, 20, 110);
      doc.setFontSize(14);
      doc.text(`Total Price: ₹${bookingData.total_price || 0}`, 20, 130);

      doc.setFontSize(16);
      doc.setTextColor("green");
      doc.text("Payment Status: PAID ✅", 20, 150);

      doc.save("Zoo_Ticket_Bill.pdf");
      alert("📄 Bill downloaded successfully!");
    } catch (error) {
      console.error("❌ Error generating bill:", error.message);
      alert("❌ Failed to generate bill. Please try again.");
    }
  };

  return (
    <div className="booking-details-container">
      <div className="booking-details-card">
        <h2 className="booking-details-title">Booking Details</h2>
        <div className="booking-details-info">
          <p><strong>Name:</strong> {bookingData.name || "N/A"}</p>
          <p><strong>Email:</strong> {bookingData.email || "N/A"}</p>
          <p><strong>Phone:</strong> {bookingData.phone || "N/A"}</p>
          <p><strong>Visit Date:</strong> {bookingData.visit_date || "N/A"}</p>
          <p><strong>Student Tickets:</strong> {bookingData.student || 0}</p>
          <p><strong>Child Tickets:</strong> {bookingData.child || 0}</p>
          <p><strong>Foreigner Tickets:</strong> {bookingData.foreigner || 0}</p>
          <p><strong>Regular Tickets:</strong> {bookingData.regular || 0}</p>
          <h3 className="booking-details-price">Total Price: ₹{bookingData.total_price || 0}</h3>
          <h4 className={`booking-details-status ${isPaid ? "paid" : "pending"}`}>
            Payment Status: {isPaid ? "PAID ✅" : "PENDING ❌"}
          </h4>
        </div>
        <div className="booking-details-actions">
          <button
            className="booking-details-btn-primary"
            onClick={handlePayment}
            disabled={isPaid || loadingPayment || ticketLimitReached}
          >
            {isPaid ? "Payment Completed" : loadingPayment ? "Processing..." : "Proceed to Payment"}
          </button>
          <button className="booking-details-btn-secondary" onClick={handleDownloadBill}>
            Download Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
