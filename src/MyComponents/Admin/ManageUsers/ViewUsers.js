import React, { useState, useEffect } from "react";
import '../AdminDashboard.css'
const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ✅ Fetch users from the backend
  useEffect(() => {
    fetchUsers();
    const user = sessionStorage.getItem("user");
    if (user) setLoggedInUser(JSON.parse(user)); // Store logged-in user info
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Error fetching users:", err);
        alert("Error fetching users. Please try again.");
      });
  };

  // ✅ Function to delete a user
  const handleDeleteUser = (userId) => {
    if (loggedInUser && loggedInUser.id === userId) {
      alert("You cannot delete yourself!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete user");
          return res.json();
        })
        .then(() => {
          alert("User deleted successfully!");
          fetchUsers(); // Refresh user list after deletion
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
          alert("Error deleting user. Please try again.");
        });
    }
  };

  return (
    <div className="view-users">
      <h2>View Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-btn"
                    disabled={loggedInUser && loggedInUser.id === user.id} // Disable button for self
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUsers;
