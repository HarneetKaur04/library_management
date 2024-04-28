import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import Home from '../Home'; // Ensure correct path to Home component

// Mock the UserDashboard and Login components
jest.mock('../UserDashboard', () => {
  return () => <div data-testid="user-dashboard-component">User Dashboard</div>;
});

jest.mock('../AdminDashboard', () => {
  return () => <div data-testid="admin-dashboard-component">Admin Dashboard</div>;
});

jest.mock('../Login', () => {
  return () => <div data-testid="login-component">Login</div>;
});

// Mock the useAdminStatus and useUser hooks
jest.mock('../../AdminStatusContext', () => ({
  useAdminStatus: jest.fn(),
}));

jest.mock('../../UserContext', () => ({
  useUser: jest.fn(),
}));

describe('Home component', () => {
  test('renders UserDashboard component when user is logged in and is not an admin', () => {
    // Mock isAdmin to false
    jest.spyOn(require('../../AdminStatusContext'), 'useAdminStatus').mockReturnValue({
      isAdmin: false,
      updateAdminStatus: jest.fn(), // Mock updateAdminStatus function
    });

    // Mock user data
    jest.spyOn(require('../../UserContext'), 'useUser').mockReturnValue({
      user: { name: 'John' },
      updateUser: jest.fn(), // Mock updateUser function
    });

    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByTestId('user-dashboard-component')).toBeInTheDocument();
  });

  test('renders AdminDashboard component when user is logged in and is an admin', () => {
    // Mock isAdmin to true
    jest.spyOn(require('../../AdminStatusContext'), 'useAdminStatus').mockReturnValue({
      isAdmin: true,
      updateAdminStatus: jest.fn(), // Mock updateAdminStatus function
    });

    // Mock user data
    jest.spyOn(require('../../UserContext'), 'useUser').mockReturnValue({
      user: { name: 'Admin' },
      updateUser: jest.fn(), // Mock updateUser function
    });

    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByTestId('admin-dashboard-component')).toBeInTheDocument();
  });

  test('renders Login component when no one is logged in', () => {
    // Mock user data to simulate no user logged in
    jest.spyOn(require('../../UserContext'), 'useUser').mockReturnValue({
      user: null,
      updateUser: jest.fn(), // Mock updateUser function
    });

    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
  });
});
