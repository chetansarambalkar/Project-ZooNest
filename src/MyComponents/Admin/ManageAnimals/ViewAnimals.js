import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AdminDashboard.css"; 

const ViewAnimals = () => {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/animals").then((response) => {
      setAnimals(response.data);
    });
  }, []);

  return (
    <div className="animal-container">
      <h2>View Animals</h2>
      <table className="animal-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr key={animal.id}>
              <td>{animal.name}</td>
              <td>{animal.age}</td>
              <td>{animal.gender}</td>
              <td>{animal.description}</td>
              <td>
                <img src={`http://localhost:5000/uploads/${animal.image}`} alt={animal.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAnimals;
