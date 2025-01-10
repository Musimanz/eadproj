import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard'); // Redirect to dashboard if logged in
    } else {
      alert('Please log in first!');
      navigate('/login');
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to the Performance Management App</h1>
      <p>Track your goals and improve your performance!</p>
      <div className="mt-4">
        <Link to="/register" className="btn btn-primary me-3">Register</Link>
        <Link to="/login" className="btn btn-secondary me-3">Login</Link>
        <button className="btn btn-success" onClick={handleDashboardClick}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
