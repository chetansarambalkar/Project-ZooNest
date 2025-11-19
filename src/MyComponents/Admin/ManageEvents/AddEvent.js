import React, { useState } from "react"; // ✅ Import useState
import "../AdminDashboard.css";  // Optional: Ensure you have a CSS file for styling

const AddEvent = ({ setEvents }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!eventName || !eventDate || !eventImage) {
      alert("⚠️ All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDate", eventDate);
    formData.append("eventImage", eventImage);

    try {
      const response = await fetch("http://localhost:5000/add-event", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (setEvents) {
        setEvents((prevEvents) => [...prevEvents, data]); // ✅ Update only if setEvents exists
      }

      setEventName("");
      setEventDate("");
      setEventImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("❌ Failed to add event.");
    }
  };

  return (
    <div className="add-event-container">
      <h3>➕ Add New Event</h3>
      <form onSubmit={handleAddEvent} className="add-event-form">
        <input
          type="text"
          placeholder="Event Description"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} required />

        {imagePreview && <img src={imagePreview} alt="Event Preview" className="preview-img" />}

        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
