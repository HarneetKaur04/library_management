import React from 'react';
import './home.css';

function Home() {
  return (
    <div className="home">
      <div className="library-image">
        <img src="https://img.freepik.com/free-photo/abundant-collection-antique-books-wooden-shelves-generated-by-ai_188544-29660.jpg?t=st=1713833541~exp=1713837141~hmac=5a2b2523839e4a83f92672ff22a5807351c0e3f3c178c5f2196724a1cd2fd665&w=2000" alt="Library" />
      </div>
      <div className="search-container">
        <h1>Welcome to Our Library</h1>
        <input type="text" placeholder="Search books..." />
        <button>Search</button>
      </div>
    </div>
  );
}

export default Home;