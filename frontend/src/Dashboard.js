import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/goals', {
          headers: { Authorization: token }
        });
        setGoals(response.data);
      } catch (err) {
        setError('Failed to fetch goals. Please log in again.');
        localStorage.removeItem('authToken'); // Clear token if error occurs
        navigate('/login');
      }
    };

    fetchGoals();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      {error && <p className="text-danger">{error}</p>}
      {!error && goals.length === 0 && <p>No goals available.</p>}
      <ul className="list-group">
        {goals.map((goal) => (
          <li key={goal._id} className="list-group-item">
            <strong>{goal.title}</strong>: {goal.description} ({goal.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
