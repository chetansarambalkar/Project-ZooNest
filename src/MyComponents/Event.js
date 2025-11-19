import React, { useEffect, useState } from "react";
import "../Event.css"; 
const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Events from Backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events");
        if (response.ok) {
          let data = await response.json();

          // ✅ Ensure Correct Image URL
          data = data.map(event => ({
            ...event,
            eventImage: event.eventImage ? `http://localhost:5000/uploads/${event.eventImage}` : "/default-event.jpg",
            eventDate: event.eventDate.split("T")[0] // ✅ Extract Date (YYYY-MM-DD)
          }));

          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-section">
      <h2 className="event-title">📅 Upcomming Zoo Events</h2>

      {loading ? (
        <p className="loading-text">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="no-events-text">No events available at the moment.</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <img 
                src={event.eventImage} 
                alt={event.eventName} 
                className="event-image"
                onError={(e) => e.target.src = "/default-event.jpg"} // ✅ Fallback Image
              />
              <div className="event-details">
                <h3 className="event-name">{event.eventName}</h3>
                <p className="event-date"> Upcomming Date:📅 {event.eventDate}</p> {/* ✅ Display Only Date */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Event;
