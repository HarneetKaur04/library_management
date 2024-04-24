import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import "./AdminDashboard.css"
import { useNavigate } from 'react-router-dom';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    // Fetch total count of users
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setTotalUsers(data.length))
      .catch(error => console.error('Error fetching total users:', error));

    // Fetch total count of books
    fetch('http://localhost:5000/api/books')
      .then(response => response.json())
      .then(data => setTotalBooks(data.length))
      .catch(error => console.error('Error fetching total books:', error));
  }, []);

  const handleUsersButtonClick = () => {
    navigate('/view-users');
  };

  const handleBooksButtonClick = () => {
    navigate('/books');
  };

  const data = {
    labels: ['Users', 'Books'],
    datasets: [
      {
        label: 'Total',
        backgroundColor: ['#007bff', '#28a745'],
        data: [totalUsers, totalBooks]
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        type: 'category'
      }
    }
  };

  return (
    <div className='admin-dash'>
      <h2>Welcome Admin</h2>
      <p>Here's your Admin Dashboard.</p>
      <div className="button-container">
        <button className="admin-button" onClick={handleUsersButtonClick}>Users</button>
        <button className="admin-button" onClick={handleBooksButtonClick}>Books</button>
      </div>
      <div className="chart-container">
        <Bar id="bar-chart" data={data} options={options} />
      </div>
    </div>
  );
};

export default AdminDashboard;
