import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from '../Footer';

describe('Footer Component', () => {
  test('renders social media links', () => {
    const { getByTestId } = render(<Footer />);
    const linkedinLink = getByTestId('linkedin-link');
    const githubLink = getByTestId('github-link');
    
    expect(linkedinLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
  });

  test('renders correct copyright text', () => {
    const { getByText } = render(<Footer />);
    const copyrightText = getByText(/Copyright © 2024 Harneet Kaur/i);
    
    expect(copyrightText).toBeInTheDocument();
  });
});
