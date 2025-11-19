import React, { useEffect, useState } from "react";

const ViewEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events"); // Ensure backend is running
        if (!response.ok) throw new Error("Failed to fetch events");

        let data = await response.json();

        // ✅ Format data (Image URL + Date Formatting)
        data = data.map((event) => ({
          ...event,
          eventImage: event.eventImage
            ? `http://localhost:5000/uploads/${event.eventImage}`
            : "/default-event.jpg",
          eventDate: event.eventDate?.split("T")[0] || "N/A", // Format date
        }));

        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("❌ Unable to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Delete Event Function
  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`http://localhost:5000/delete-event/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete the event");

      // ✅ Remove deleted event from UI
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));

      alert("🗑 Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("❌ Error occurred while deleting.");
    }
  };

  return (
    <div className="view-event-container">
      <h2 className="view-event-title">📅 Zoo Events</h2>

      {loading ? (
        <p className="loading-text">Loading events...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : events.length === 0 ? (
        <p className="no-events-text">No events found.</p>
      ) : (
        <table className="event-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <img
                    src={event.eventImage}
                    alt={event.eventName}
                    className="event-img"
                    onError={(e) => (e.target.src = "/default-event.jpg")} // Fallback image
                  />
                </td>
                <td>{event.eventName}</td>
                <td>{event.eventDate}</td>
                <td>
                  <button className="delete-event-button" onClick={() => handleDelete(event.id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewEvent;
