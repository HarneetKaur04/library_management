import React from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Register from '../Register';

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Register component', () => {
  test('renders register form with input fields', () => {
    render(
      <Router>
        <Register />
      </Router>
    );
    
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone No.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const contactInput = screen.getByPlaceholderText('Phone No.');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(contactInput, { target: { value: '1234567890' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(contactInput).toHaveValue('1234567890');
  });

  test('handles form submission and API call', async () => {
    // Mock useNavigate hook
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    // Mock fetch function to simulate API call
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User registered successfully!' }),
    });

    render(
      <Router>
        <Register />
      </Router>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const contactInput = screen.getByPlaceholderText('Phone No.');
    const registerButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(contactInput, { target: { value: '1234567890' } });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          contact: '1234567890',
        }),
      });
    });

    // Check if useNavigate was called with '/'
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
