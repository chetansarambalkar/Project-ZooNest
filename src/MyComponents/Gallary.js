import React, { useEffect, useState } from "react";
import axios from "axios";
import '../Gallary.css'

const Gallery = () => {
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Animals from Backend
  const fetchAnimals = () => {
    axios
      .get("http://localhost:5000/animals")
      .then((response) => {
        setAnimals(response.data);
        setFilteredAnimals(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching animals:", error);
        setError("Failed to load animals. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnimals();

    // Optional: Auto-refresh every 10 seconds to check for updates
    const interval = setInterval(fetchAnimals, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (searchTerm !== "") {
      const filtered = animals.filter((animal) =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAnimals(filtered);
      setSuggestions(filtered.slice(0, 5)); // Show only top 5 suggestions
    } else {
      setFilteredAnimals(animals);
      setSuggestions([]);
    }
  };

  // Handle Click on Suggestion
  const handleSuggestionClick = (name) => {
    setSearch(name);
    setFilteredAnimals(animals.filter((animal) => animal.name === name));
    setSuggestions([]);
  };

  return (
    <div className="gallery-container">
      <h2>Animal Gallary</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for an animal..."
          value={search}
          onChange={handleSearchChange}
        />
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestion-list">
            {suggestions.map((animal) => (
              <div
                key={animal.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(animal.name)}
              >
                {animal.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading & Error Messages */}
      {loading && <p>Loading animals...</p>}
      {error && <p className="error">{error}</p>}

      <div className="gallery-grid">
        {filteredAnimals.length > 0 ? (
          filteredAnimals.map((animal) => (
            <div key={animal.id} className="gallery-card">
              <img
                src={`http://localhost:5000/uploads/${animal.image}`}
                alt={animal.name}
              />
              <div className="gallery-info">
                <h3>{animal.name}</h3>
                <p>
                  <strong>Age:</strong> {animal.age}
                </p>
                <p>
                  <strong>Gender:</strong> {animal.gender}
                </p>
                <p>{animal.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No animals found.</p>
        )}
      </div>
    </div>
  );
};

export default Gallery;
