import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password, contact, age } = formData;

    if (!name.trim() || !email.trim() || !password.trim() || !contact.trim() || !age.trim()) {
      setError("All fields are required.");
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setError("Name can only contain letters and spaces.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (!/^\d{10}$/.test(contact)) {
      setError("Contact number must be exactly 10 digits.");
      return false;
    }

    if (!/^\d+$/.test(age) || age < 1 || age > 100) {
      setError("Enter a valid age between 1 and 100.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/register", formData);
      setSuccess(res.data.message || "Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
  <div className="auth-box">
    <div className="auth-left">
      <h2 className="auth-left-title">Join Us Today</h2>
      <p className="auth-left-text">Create an account to access exclusive features.</p>
      <p className="auth-left-text">
        Already have an account? <a href="/login" className="auth-left-link">Sign in</a>
      </p>
    </div>

    <div className="auth-right">
      <h2 className="auth-right-title">Register</h2>
      {error && <p className="auth-message-error">{error}</p>}
      {success && <p className="auth-message-success">{success}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          className="auth-input"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          className="auth-input"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          className="auth-input"
          placeholder="Contact No."
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          className="auth-input"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <div className="auth-password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="auth-input auth-password-input"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="auth-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  </div>
</div>

  );
};

export default Register;
