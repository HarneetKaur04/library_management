import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddBook from '../AddBook';

describe('AddBook component', () => {
  test('renders add book form with input fields', () => {
    render(<AddBook />);
    
    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('Author:')).toBeInTheDocument();
    expect(screen.getByLabelText('ISBN:')).toBeInTheDocument();
    expect(screen.getByLabelText('Publication Date:')).toBeInTheDocument();
    expect(screen.getByLabelText('Genre:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Book' })).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<AddBook />);
    
    const titleInput = screen.getByLabelText('Title:');
    const authorInput = screen.getByLabelText('Author:');
    const isbnInput = screen.getByLabelText('ISBN:');
    const publicationDateInput = screen.getByLabelText('Publication Date:');
    const genreInput = screen.getByLabelText('Genre:');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(authorInput, { target: { value: 'Test Author' } });
    fireEvent.change(isbnInput, { target: { value: '1234567890' } });
    fireEvent.change(publicationDateInput, { target: { value: '2022-04-28' } });
    fireEvent.change(genreInput, { target: { value: 'Test Genre' } });

    expect(titleInput).toHaveValue('Test Title');
    expect(authorInput).toHaveValue('Test Author');
    expect(isbnInput).toHaveValue('1234567890');
    expect(publicationDateInput).toHaveValue('2022-04-28');
    expect(genreInput).toHaveValue('Test Genre');
  });

  test('handles form submission and API call', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
    });

    render(<AddBook />);
    
    const titleInput = screen.getByLabelText('Title:');
    const authorInput = screen.getByLabelText('Author:');
    const isbnInput = screen.getByLabelText('ISBN:');
    const publicationDateInput = screen.getByLabelText('Publication Date:');
    const genreInput = screen.getByLabelText('Genre:');
    const addButton = screen.getByRole('button', { name: 'Add Book' });

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(authorInput, { target: { value: 'Test Author' } });
    fireEvent.change(isbnInput, { target: { value: '1234567890' } });
    fireEvent.change(publicationDateInput, { target: { value: '2022-04-28' } });
    fireEvent.change(genreInput, { target: { value: 'Test Genre' } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/books/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Title',
          author: 'Test Author',
          isbn: '1234567890',
          publication_date: '2022-04-28',
          genre: 'Test Genre',
        }),
      });
    });
  });
});
