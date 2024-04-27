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
    <div className='admin-dash' data-testid="admin-dashboard-component">
      <h2>Welcome Admin</h2>
      <div className='container-top-img-admin'>
        <img src="https://i.pinimg.com/originals/ab/9e/5a/ab9e5ac5627187fa9e9d4606db7dd29c.gif" alt="Book Club" className="checkinout-image" />
        <h3>Welcome to the Library Admin Dashboard! Easily manage user accounts and library resources with intuitive controls. From user management to book acquisition and circulation, streamline your administrative tasks effortlessly.</h3>
      </div>
      <div className="button-container">
        <button className="admin-button" onClick={() => navigate('/view-users')}>View/Edit/Delete all registered users</button>
        <button className="admin-button" onClick={() => navigate('/register')}>Add a new user</button>
        <button className="admin-button" onClick={() => navigate('/books')}>View/Edit/Delete catalogue of books</button>
        <button className="admin-button" onClick={() => navigate('/add-books')}>Acquire a new book for library</button> 
        <button className="admin-button" onClick={() => navigate('/check-in-out')}>Initiate a check-in/check-out for a user</button>
        <button className="admin-button" onClick={() => navigate('/reserve-books')}>Reserve a book for a user</button>
      </div>
      <div className="chart-container">
        <Bar id="bar-chart" data={data} options={options} />
      </div>
    </div>
  );
};

export default AdminDashboard;
