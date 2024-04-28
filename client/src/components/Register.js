import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Register.css';

const API_URL = 'http://localhost:5000/api/users';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState(null); // State for error message
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, contact}),
      });
      if (response.ok) {
        console.log('User registered successfully!');
        // Redirect to home page after successful registration
        navigate('/'); // Redirect to home page
      } else {
        // Handle registration error
        const errorMessage = await response.text(); // Extract error message from response
        setError(errorMessage); // Set error message state
        console.error('Failed to register user:', errorMessage);
      }
    } catch (error) {
      // Handle network or server errors
      setError('Failed to register user. Please try again later.'); // Set error message state
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className='register-form'>
      <h2>Register</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="contact" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if it exists */}
    </div>
  );
};

export default Register;
