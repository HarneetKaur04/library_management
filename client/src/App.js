import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './components/Login';
import Register from './components/Register';
import Books from './components/Books';
import BookDetails from './components/BookDetails';
import Footer from "./components/Footer";
import Navbar from './components/Navbar';

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