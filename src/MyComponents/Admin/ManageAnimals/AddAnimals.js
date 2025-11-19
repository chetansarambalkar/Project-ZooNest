import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css"; 

const AddAnimal = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    description: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    await axios.post("http://localhost:5000/add-animal", formData);
    navigate("/manage-animals/view");
  };

  return (
    <div className="animal-container">
      <h2>Add Animal</h2>
      <form onSubmit={handleSubmit} className="animal-form">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="file" name="image" accept="image/*" onChange={handleChange} required />
        <button type="submit">Add Animal</button>
      </form>
    </div>
  );
};

export default AddAnimal;
