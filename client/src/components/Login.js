import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStatus } from '../AdminStatusContext';
import { useUser } from '../UserContext';
import './Login.css';

const Login = () => {
  const { updateAdminStatus } = useAdminStatus();
  const { updateUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      // Clear form fields
      setEmail('');
      setPassword('');
      setError(null);

      // Get user data from response
      const userData = await response.json();

      // Check if the user is an admin based on email address
      const isAdmin = userData.user.email === 'test@test.com';

      // Update admin status
      updateAdminStatus(isAdmin);

      // Update user data
      updateUser(userData.user);

      // Navigate to 'home'
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
