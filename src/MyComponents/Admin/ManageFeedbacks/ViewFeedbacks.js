import React, { useEffect, useState } from "react";

export default function ViewFeedbacks() {
  const [feedbackList, setFeedbackList] = useState([]);

  // Fetch feedback data
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = () => {
    fetch("http://localhost:5000/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbackList(data))
      .catch((error) => console.error("Error fetching feedback:", error));
  };

  // Delete feedback
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      fetch(`http://localhost:5000/feedback/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            alert("Feedback deleted successfully!");
            fetchFeedback(); // Refresh the list
          } else {
            alert("Error deleting feedback");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  return (
    <div className="feedback-container">
      <h2>User Feedback</h2>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.name}</td>
              <td>{feedback.email}</td>
              <td>{feedback.message}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(feedback.id)}>
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
