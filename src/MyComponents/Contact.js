import React, { useState } from "react";
import '../Contact.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]{2,30}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name must contain only letters and be 2-30 characters long.";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.message.trim().length === 0) {
      newErrors.message = "Message cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Your message has been submitted!");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        alert("Error submitting feedback!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-info">
        <div className="info-box">
          <div className="icon">📍</div>
          <p><strong>Address:</strong><br /> 8500, abc Street, Zrv, IL, 55030</p>
        </div>
        <div className="info-box">
          <div className="icon">📞</div>
          <p><strong>Call us:</strong><br /> (123) 456-78-80</p>
        </div>
        <div className="info-box">
          <div className="icon">📧</div>
          <p><strong>Email:</strong><br /> ZooNest@example.com</p>
        </div>
      </div>

      <div className="contact-box">
        <h2>Drop a Line</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Name*"
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email*"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Message"
          ></textarea>
          {errors.message && <span className="error">{errors.message}</span>}

          <button type="submit" className="submit-btn">ADD COMMENT</button>
        </form>
      </div>
    </div>
  );
}
