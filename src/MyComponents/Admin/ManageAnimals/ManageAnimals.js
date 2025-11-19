import React, { useState, useEffect } from "react";
import axios from "axios";
import "../AdminDashboard.css"; 

const ManageAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    description: "",
    image: null,
  });

  // Fetch animals from backend
  useEffect(() => {
    axios.get("http://localhost:5000/animals").then((response) => {
      setAnimals(response.data);
    });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Add new animal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    await axios.post("http://localhost:5000/add-animal", formData);
    window.location.reload();
  };

  // Delete animal
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/delete-animal/${id}`);
    window.location.reload();
  };

  return (
    <div className="manage-animals">
      <h2>Manage Animals</h2>

      {/* Animal Form */}
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

      {/* Animal List */}
      <h3>Existing Animals</h3>
      <div className="animal-list">
        {animals.map((animal) => (
          <div key={animal.id} className="animal-card">
            <img src={`http://localhost:5000/uploads/${animal.image}`} alt={animal.name} />
            <h4>{animal.name}</h4>
            <p>{animal.description}</p>
            <button onClick={() => handleDelete(animal.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAnimals;
