import React, { useState, useEffect } from 'react';
import './Reserve.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAdminStatus } from '../AdminStatusContext';
import { useUser } from '../UserContext';

function Reserve() {
    const [checkedOutBooks, setCheckedOutBooks] = useState([]);
    const { isAdmin } = useAdminStatus(); // Use the useAdminStatus hook to get isAdmin state
    const { user } = useUser(); // Use the useUser hook to get user data
    const navigate = useNavigate(); // Use the useNavigate hook

    const [selectedBookId, setSelectedBookId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCheckedOutBooks();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            const filteredUsers = data.filter(user => user.email !== 'admin@test.com');
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error getting users:", error);
        }
    };

    const fetchCheckedOutBooks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/circulation/checked-out-books');
            if (!response.ok) {
                throw new Error('Failed to fetch checked-out books');
            }
            const data = await response.json();
            setCheckedOutBooks(data.checkedOutBooks);
        } catch (error) {
            console.error('Error fetching checked-out books:', error);
        }
    };

    const handleReserve = async () => {
        try {
            let requestBody;
            if (isAdmin) {
                requestBody = { bookId: selectedBookId, userId: selectedUserId };
            } else {
                requestBody = { bookId: selectedBookId, userId: user.id };
            }
            const response = await fetch('http://localhost:5000/api/circulation/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error('Failed to reserve book');
            }
            const data = await response.json();
            setMessage(data.message);
            setSelectedBookId('')
            setSelectedUserId('')
            fetchCheckedOutBooks();
        } catch (error) {
            console.error('Error reserving book:', error);
            setMessage('An error occurred while reserving the book.');
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className='reserve-container'>
            <h2>Reserve a Book</h2>
            <select value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)} className="reserve-select">
                <option value="">Select a book to reserve</option>
                {checkedOutBooks.map(book => (
                    <option key={book.id} value={book.id}>{book.title} by {book.author}</option>
                ))}
            </select>
            {isAdmin && (
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="reserve-select">
                    <option value="">Select a user</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
            )}
            <button onClick={handleReserve} className="reserve-button">Reserve</button>
            <p className='reserve-message'>{message}</p>
        </div>
    );
}

export default Reserve;
