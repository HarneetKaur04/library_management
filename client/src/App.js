import React from 'react';
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

function App() {
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={
            <div className="App">
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