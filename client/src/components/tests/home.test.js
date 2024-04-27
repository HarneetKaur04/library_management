import React from 'react';
import { render } from '@testing-library/react';
import Home from '../home'; // Corrected import path for Home component

jest.mock('../../AdminStatusContext', () => ({ // Corrected import path for AdminStatusContext
  useAdminStatus: jest.fn(),
}));

jest.mock('../../UserContext', () => ({ // Corrected import path for UserContext
  useUser: jest.fn(),
}));

describe('Home Component', () => {
  test('renders Login component when user is not logged in', () => {
    // Mock useUser hook to return null user
    const useUserMock = jest.fn();
    useUserMock.mockReturnValue({ user: null });
    require('../../UserContext').useUser = useUserMock;

    const { getByTestId } = render(<Home />);
    expect(getByTestId('login-component')).toBeInTheDocument();
  });

  test('renders AdminDashboard component when user is an admin', () => {
    // Mock useAdminStatus hook to return isAdmin as true
    const useAdminStatusMock = jest.fn();
    useAdminStatusMock.mockReturnValue({ isAdmin: true });
    require('../../AdminStatusContext').useAdminStatus = useAdminStatusMock;

    const { getByTestId } = render(<Home />);
    expect(getByTestId('admin-dashboard-component')).toBeInTheDocument();
  });

  test('renders UserDashboard component when user is not an admin', () => {
    // Mock useUser hook to return non-null user
    const useUserMock = jest.fn();
    useUserMock.mockReturnValue({ user: { id: 1, name: 'Test User' } });
    require('../../UserContext').useUser = useUserMock;

    // Mock useAdminStatus hook to return isAdmin as false
    const useAdminStatusMock = jest.fn();
    useAdminStatusMock.mockReturnValue({ isAdmin: false });
    require('../../AdminStatusContext').useAdminStatus = useAdminStatusMock;

    const { getByTestId } = render(<Home />);
    expect(getByTestId('user-dashboard-component')).toBeInTheDocument();
  });
});
