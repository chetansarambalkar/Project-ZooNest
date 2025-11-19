import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./MyComponents/Header";
import Home from "./MyComponents/Home";
import Footer from "./MyComponents/Footer";
import Booking from "./MyComponents/Booking";
import BookingDetails from "./MyComponents/BookingDetails";
import Gallary from './MyComponents/Gallary';
import Upperheader from './MyComponents/Upperheader';
import About from './MyComponents/About';
import Login from './MyComponents/Login';
import Register from './MyComponents/Register';
import Contact from './MyComponents/Contact';
import AdminDashboard from './MyComponents/Admin/AdminDashboard';
import Event from './MyComponents/Event';
import AddAnimals from './MyComponents/Admin/ManageAnimals/AddAnimals';
import ViewTickets from './MyComponents/Admin/ManageTickets/ViewTickets';
import ViewFeedbacks from './MyComponents/Admin/ManageFeedbacks/ViewFeedbacks';
import DeleteAnimals from './MyComponents/Admin/ManageAnimals/DeleteAnimals';
import ViewAnimals from './MyComponents/Admin/ManageAnimals/ViewAnimals';
import AddEvent from './MyComponents/Admin/ManageEvents/AddEvent';
import ViewEvent from './MyComponents/Admin/ManageEvents/ViewEvent';
import ViewUsers from './MyComponents/Admin/ManageUsers/ViewUsers';

// 🔹 Protect admin routes based on user role
const ProtectedRoute = ({ element }) => {
  const user = JSON.parse(sessionStorage.getItem("user")); // Use sessionStorage for security

  if (!user || user.role !== "admin") {
    alert("Access Denied! Admins only.");
    return <Navigate to="/login" />;
  }

  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Upperheader /><Header /><Home /><Footer /></>} />
        <Route path="/about" element={<><Upperheader /><Header /><About /><Footer /></>} />
        <Route path="/booking" element={<><Upperheader /><Header /><Booking /><Footer /></>} />
        <Route path="/gallary" element={<><Upperheader /><Header /><Gallary /><Footer /></>} />
        <Route path="/contact" element={<><Upperheader /><Header /><Contact /><Footer /></>} />
        <Route path="/event" element={<><Upperheader /><Header /><Event /><Footer /></>} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/manage-animals/add" element={<ProtectedRoute element={<AddAnimals />} />} />
        <Route path="/manage-animals/delete" element={<ProtectedRoute element={<DeleteAnimals />} />} />
        <Route path="/manage-animals/view" element={<ProtectedRoute element={<ViewAnimals />} />} />
        <Route path="/manage-tickets/view" element={<ProtectedRoute element={<ViewTickets />} />} />
        <Route path="/manage-feedbacks/view" element={<ProtectedRoute element={<ViewFeedbacks />} />} />
        <Route path="/manage-events/add" element={<ProtectedRoute element={<AddEvent />} />} />
        <Route path="/manage-events/view" element={<ProtectedRoute element={<ViewEvent />} />} />
        <Route path="/manage-users/view" element={<ProtectedRoute element={<ViewUsers />} />} />

        {/* Booking Details Route */}
        <Route path="/booking-details" element={<BookingDetails />} />

        {/* Catch-all Route (404) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
