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

  // Function to handle click on the Users bar
  const handleUsersBarClick = () => {
    // Navigate to view-users page
    navigate('/view-users');
  };

  // Function to handle click on the Books bar
  const handleBooksBarClick = () => {
    // Navigate to view-users page
    navigate('/books');
  };

  // Data for the bar chart
  const data = {
    labels: ['Users', 'Books'],
    datasets: [
      {
        label: 'Total',
        backgroundColor: ['#007bff', '#28a745'], // Blue for users, green for books
        data: [totalUsers, totalBooks]
      }
    ]
  };

  // Options for the bar chart
  const options = {
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        type: 'category'
      }
    },
    onClick: (event, elements) => {
      // Check if click occurred on the Books bar
      if (elements[0] && elements[0].datasetIndex === 0) {
        handleUsersBarClick();
      } else if (elements[1] && elements[1].datasetIndex === 1) {
        handleBooksBarClick()
      }
    }
  };

  return (
    <div className='admin-dash'>
      <h2>Welcome Admin</h2>
      <p>Here's your Admin Dashboard.</p>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default AdminDashboard;
