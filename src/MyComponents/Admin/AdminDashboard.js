import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({}); // Store multiple dropdown states
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  // ✅ Fetch statistics from the backend
  useEffect(() => {
    fetch("http://localhost:5000/animals")
      .then((res) => res.json())
      .then((data) => setTotalAnimals(data.length))
      .catch((err) => console.error("Error fetching animals:", err));

    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setTotalEvents(data.length))
      .catch((err) => console.error("Error fetching events:", err));

    fetch("http://localhost:5000/feedback")
      .then((res) => res.json())
      .then((data) => setTotalFeedbacks(data.length))
      .catch((err) => console.error("Error fetching feedback:", err));

    fetch("http://localhost:5000/bookings")
      .then((res) => res.json())
      .then((data) => setTotalBookings(data.length))
      .catch((err) => console.error("Error fetching bookings:", err));

    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setTotalUsers(data.length))
      .catch((err) => console.error("Error fetching users:", err));

    // ✅ Load stored dropdown states from sessionStorage
    const storedDropdowns = JSON.parse(sessionStorage.getItem("openDropdowns"));
    if (storedDropdowns) {
      setOpenDropdowns(storedDropdowns);
    }
  }, []);

  // ✅ Toggle individual dropdowns and store state in sessionStorage
  const handleDropdownClick = (menu) => {
    const updatedDropdowns = {
      ...openDropdowns,
      [menu]: !openDropdowns[menu], // Toggle the clicked menu
    };
    setOpenDropdowns(updatedDropdowns);
    sessionStorage.setItem("openDropdowns", JSON.stringify(updatedDropdowns));
  };

  // ✅ Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("openDropdowns"); // Clear dropdown states on logout
    alert("You have been logged out!");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Zoo Admin</h2>
        <ul>
          <li>
            <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
              Dashboard
            </Link>
          </li>

          {/* Manage Animals Dropdown */}
          <li onClick={() => handleDropdownClick("animals")} className="dropdown">
            Manage Animals
            <ul className={`submenu ${openDropdowns["animals"] ? "open" : ""}`}>
              <li><Link to="/manage-animals/add">Add Animal</Link></li>
              <li><Link to="/manage-animals/delete">Delete Animal</Link></li>
              <li><Link to="/manage-animals/view">View Animals</Link></li>
            </ul>
          </li>

          {/* Manage Tickets Dropdown */}
          <li onClick={() => handleDropdownClick("tickets")} className="dropdown">
            Manage Tickets
            <ul className={`submenu ${openDropdowns["tickets"] ? "open" : ""}`}>
              <li><Link to="/manage-tickets/view">View Tickets</Link></li>
            </ul>
          </li>

          {/* Manage Events Dropdown */}
          <li onClick={() => handleDropdownClick("events")} className="dropdown">
            Manage Events
            <ul className={`submenu ${openDropdowns["events"] ? "open" : ""}`}>
              <li><Link to="/manage-events/add">Add Event</Link></li>
              <li><Link to="/manage-events/view">View Events</Link></li>
            </ul>
          </li>

          {/* Manage Feedback Dropdown */}
          <li onClick={() => handleDropdownClick("feedback")} className="dropdown">
            Manage Feedback
            <ul className={`submenu ${openDropdowns["feedback"] ? "open" : ""}`}>
              <li><Link to="/manage-feedbacks/view">View Feedback</Link></li>
            </ul>
          </li>

          {/* Manage Users Dropdown */}
          <li onClick={() => handleDropdownClick("users")} className="dropdown">
            Manage Users
            <ul className={`submenu ${openDropdowns["users"] ? "open" : ""}`}>
              <li><Link to="/manage-users/view">View Users</Link></li>
            </ul>
          </li>

          {/* Logout Button */}
          <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>Welcome to the Zoo Admin Dashboard</h2>
        <div className="stats-container">
          <div className="stat-box blue">
            <p>Total Users</p>
            <h3>{totalUsers}</h3> {/* ✅ Dynamic Count */}
          </div>
          <div className="stat-box green">
            <p>Total Feedback</p>
            <h3>{totalFeedbacks}</h3> {/* ✅ Dynamic Count */}
          </div>
          <div className="stat-box green">
            <p>Total Animals</p>
            <h3>{totalAnimals}</h3> {/* ✅ Dynamic Count */}
          </div>
          <div className="stat-box orange">
            <p>Total Events</p>
            <h3>{totalEvents}</h3> {/* ✅ Dynamic Count */}
          </div>
          <div className="stat-box yellow">
            <p>Total Booking Tickets</p>
            <h3>{totalBookings}</h3> {/* ✅ Dynamic Count */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
