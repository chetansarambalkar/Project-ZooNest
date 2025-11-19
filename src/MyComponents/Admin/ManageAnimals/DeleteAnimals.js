import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AdminDashboard.css"; 

const DeleteAnimal = () => {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/animals").then((response) => {
      setAnimals(response.data);
    });
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/delete-animal/${id}`);
    setAnimals(animals.filter(animal => animal.id !== id));
  };

  return (
    <div className="animal-container">
      <h2>Delete Animal</h2>
      <div className="animal-list">
        {animals.map((animal) => (
          <div key={animal.id} className="animal-card">
            <h4>{animal.name}</h4>
            <p>{animal.description}</p>
            <button onClick={() => handleDelete(animal.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeleteAnimal;
