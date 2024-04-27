import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Books from './components/Books';
import BookDetails from './components/BookDetails';
import Footer from "./components/Footer";
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AddBook from './components/AddBook';
import User from './components/Users';
import UserProfile from './components/UserProfile';
import CheckInOut from './components/CheckInCheckOut'
import Reserve from './components/Reserve'
import './app.css';

function App() {
  // State to manage the index of the current background image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of image URLs
  const images = [
    '/assets/image1.jpg',
    '/assets/image2.jpg',
    '/assets/image3.webp',
    '/assets/image4.jpg',
    '/assets/image5.jpg'
  ];

  // Use useEffect to change the images at a specified interval
  useEffect(() => {
    // Set up interval to change images every 4 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 4000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);
  
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={
            <div className="App">
              {/* Apply the background image style dynamically */}
              <div className="background-image" style={{ backgroundImage: `url(${images[currentImageIndex]})` }} />
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/books/:id" element={<BookDetails />} />
                  <Route path="/add-books" element={<AddBook/>} />
                  <Route path="/view-users" element={<User/>} />
                  <Route path="/profile" element={<UserProfile/>} />
                  <Route path="/check-in-out" element={<CheckInOut/>} />
                  <Route path="/reserve-books" element={<Reserve/>} />
                </Routes>
                <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
