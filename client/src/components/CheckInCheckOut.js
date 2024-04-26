import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAdminStatus } from '../AdminStatusContext';
import { useUser } from '../UserContext';
import './CheckInCheckOut.css'; // Import the CSS file

function CheckInOut() {
    const [availableBooks, setAvailableBooks] = useState([]);
    const [checkedOutBooks, setCheckedOutBooks] = useState([]);
    const [selectedCheckInBookId, setSelectedCheckInBookId] = useState('');
    const [selectedCheckOutBookId, setSelectedCheckOutBookId] = useState('');
    const [users, setUsers] = useState('');
    const { isAdmin } = useAdminStatus(); // Use the useAdminStatus hook to get isAdmin state
    const { user } = useUser(); // Use the useUser hook to get user data
    const [selectedUserId, setSelectedUserId] = useState(''); // Selected user for check-out
    const [checkOutMessage, setCheckOutMessage] = useState('');
    const [checkInMessage, setCheckInMessage] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook

    useEffect(() => {
        updateBooksAvailability();
        fetchUsers();
        fetchBooksInfo();
    }, []);

    const updateBooksAvailability = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/circulation/update_books_availability');
            if (!response.ok) {
                throw new Error('Failed to update books availability');
            }
        } catch (error) {
            console.error("Error updating books", error);
        }
    };

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

    const fetchBooksInfo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/circulation/fetchBooksInfo');
            if (!response.ok) {
                throw new Error('Failed to fetch books information');
            }
            const data = await response.json();
            setAvailableBooks(data.allAvailableBooks);
            setCheckedOutBooks(data.checkedOutBooksByAllUsers);
        } catch (error) {
            console.error('Error fetching books information:', error);
        }
    };

    const handleCheckIn = async () => {
        try {
            let requestBody;
            if (isAdmin) {
                // Get the user ID associated with the checked-out book
                const selectedBook = checkedOutBooks.find(book => book.book_id == selectedCheckInBookId);
                if (!selectedBook) {
                    throw new Error('Selected book not found');
                }
                requestBody = { bookId: selectedCheckInBookId, userId: selectedBook.user_id };
            } else {
                requestBody = { bookId: selectedCheckInBookId, userId: user.id };
            }
    
            const response = await fetch('http://localhost:5000/api/circulation/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                throw new Error('Failed to check in book');
            }
    
            const data = await response.json();
            setCheckInMessage(data.message);
            updateBooksAvailability();
            fetchBooksInfo();
        } catch (error) {
            console.error('Error checking in:', error);
            setCheckInMessage('An error occurred while checking in.');
        }
    };

    const handleCheckOut = async () => {
        try {
            let requestBody;
            if (isAdmin) {
                requestBody = { bookId: selectedCheckOutBookId, userId: selectedUserId };
            } else {
                requestBody = { bookId: selectedCheckOutBookId, userId: user.id };
            }
            const response = await fetch('http://localhost:5000/api/circulation/check-out', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to check out book');
            }

            const data = await response.json();
            setCheckOutMessage(data.message);
            setSelectedUserId('')
            fetchBooksInfo();
        } catch (error) {
            console.error('Error checking out:', error);
            setCheckOutMessage('An error occurred while checking out.');
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    const userCheckedOutBooks = checkedOutBooks.filter(book => book.user_id === user.id);

    // Automatically set selectedUserId based on the checked out books
    useEffect(() => {
        if (userCheckedOutBooks.length > 0) {
            setSelectedUserId(userCheckedOutBooks[0].user_id);
        }
    }, [userCheckedOutBooks]);

    return (
        <div className="checkinout-container">
            <h1>Library Books Check In/ Check Out System</h1>
            <div className="checkinout-card">
                <h2>Check In Books</h2>
                <select value={selectedCheckInBookId} onChange={(e) => setSelectedCheckInBookId(e.target.value)} className="checkinout-select">
                    <option value="">Select Book</option>
                    {(isAdmin ? checkedOutBooks : userCheckedOutBooks).map(book => (
                        <option key={book.book_id} value={book.book_id}>
                            {book.book_title} - Checked Out by User: {book.username} - Checked Out On: {new Date(book.checkout_date).toLocaleDateString()} - Return Date: {book.return_date ? new Date(book.return_date).toLocaleDateString() : 'N/A'}
                        </option>
                    ))}
                </select>
                <button onClick={handleCheckIn} className="checkinout-button">Check In</button>
                <p className='checkinout-message'>{checkInMessage}</p>
            </div>
            <div className="checkinout-card">
                <h2>Check Out Books</h2>
                <select value={selectedCheckOutBookId} onChange={(e) => setSelectedCheckOutBookId(e.target.value)} className="checkinout-select">
                    <option value="">Select Book</option>
                    {availableBooks.map(book => (
                        <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                </select>
                {isAdmin && users && (
                    <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="checkinout-select">
                        <option value="">Select User</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.username}</option>
                        ))}
                    </select>
                )}
                <button onClick={handleCheckOut} className="checkinout-button">Check Out</button>
                <p className='checkinout-message'>{checkOutMessage}</p>
            </div>
        </div>
    );
}

export default CheckInOut;
