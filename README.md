<p align="center">LIBRARY MANAGEMENT SYSTEM<p/>
<p align="center">
  <img src="/client/public/assets/library_management_system_preview.gif" alt="Library Management System">
</p>
<br/>
Full Demo Video Link: <a href="/client/public/assets/library_management_system.mp4">Live Webpage Recording</a>

Test admin you should use: admin@test.com  password: password
<br/>
Test user you can use: homer@simpson.com  password: homer


## Contents
- [Overview](#overview)
- [Installation and Set Up](#installation-and-set-up)
- [Dependencies](#dependencies)
- [Database Set Up](#database-set-up)
- [Routes](#routes)
- [Tests](#tests)
- [Future Development](#future-development)

## Overview
The Library Management System is a web application designed to facilitate the management of a library's resources, including books and user accounts. It provides features for user authentication, user management, book management, circulation management, and search and retrieval functionalities.

### Key Components:
#### User Authentication:
- Users can register for an account and login securely.
- Authentication ensures secure access to library services like editing/deleting/favoriting/check-in-out/reserve and resources based on the role (admin vs other users)
#### User Management:
- Admin can manage users by adding/editing/deleting/viewing users and their personal details. Users can also edit their profile.
- User profiles can manage their personal library by logging into their personal dashboard, favoriting/unfavorites books, see all books read by a user, checked out books etc.
#### CRUD Operation for Books:
- Admin can perform CRUD operations on books: adding, viewing, updating, and deleting books. Users can view/add/favorite/unfavorite a book.
#### Book Management:
- The system allows for the acquisition, cataloging and organization of books within the library.
- Each book entry includes details such as title, author, ISBN, publication date, and genre.
#### Circulation Management:
- Automated processes handle book check-in and reservation to streamline circulation activities for overdue return books and assigning to reserved user.
- Users as well as Admin can check-in books, check-out books and place reservations for books that are currently unavailable (i.e. checked out by some user)
#### Search and Retrieval:
The system offers search mechanism for users to quickly locate books, authors, genre under books tab, users for admin under users tab and library resources on navbar.
Search functionalities include keyword search, locating books by title using alphabets on top, and advanced filter search for author search, genre search.

## Installation and Set Up
- Go to your source directory in your terminal and run the command `git clone https://github.com/HarneetKaur04/library_management.git NAMENEWDIRECTORY`
- To clean your folder from the owner git, run the command `rm -rf .git`
- Run the command `git init` to start your git repository 

### To install, set up and work in the server side
- Go to the server folder in the project (`cd server`) and run the command `npm install`
- Inside your server folder, create an .env file with `touch .env`
- Inside your server folder, open the file `.env.example` and copy the file to .env with your own credentials and keys. 
- BACK TO THE TERMINAL - To restore the DB dump file that the project already contain, just run the command `psql -U postgres -f db.sql`. Make sure that you have your Postgres password on hand. The psql console will ask you for your password.  If you had configured your postgres without password just run the command `psql -f db.sql`
- At this point you can run the command `node server.js` to run your server

### Now, back to the terminal to work on your frontend
- Go to the cliente folder (`cd .. and cd client`) and run the command `npm install`
- Run frontend with `npm start`

### To run test, use cmd:
- `npx jest`

## Dependencies
### Server Dependencies:
- bcrypt: Used for hashing passwords securely for login/register and authentication purpose, ensuring sensitive user data remains protected.
- cors: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.js.
- dotenv: Used for loading environment variables from a .env file into process.env, facilitating configuration management and enhancing security by keeping sensitive data out of version control.
- express: Web framework for Node.js used for building APIs and web applications.
- pg: PostgreSQL client for Node.js, utilized for interacting with the PostgreSQL database, enabling data storage and retrieval.
- pg-promise: Promise-based PostgreSQL client for Node.js, offering an alternative to the callback-based approach for interacting with PostgreSQL, enhancing code readability and maintainability.
### Client Dependencies:
- chart.js: JavaScript library for creating charts and graphs used in Admin Dashboard.
- react-chartjs-2: React wrapper for Chart.js, allowing easy integration of charts into the application.
- react-dom: Used for rendering React components into the DOM.
- react-router-dom: Library for declaratively routing in React applications, enabling navigation between different views/components based on URL changes, enhancing user experience and application organization.
- react-scripts: Scripts and configuration used by Create React App for building and running React applications.
- @babel/preset-env: Babel preset for compiling JavaScript down to a version of JavaScript that can be executed by the majority of browsers. It was necessary for running JSX.
- @babel/preset-react: Babel preset for compiling JSX and React into JavaScript, necessary for transforming JSX syntax into JavaScript code that browsers can understand. It was necessary for running JSX.
- @testing-library/jest-dom: Jest DOM testing utility library for matching and querying DOM elements during tests.
- babel-jest: Jest transformer for JavaScript code, used for transforming JavaScript code using Babel during testing.
- jest: Testing framework for JavaScript code, used for writing and running tests.

## Database Set Up
### Tables:
#### Books Table (books):
- Stores information about books including title, author, ISBN, genre, publication date, and availability status.
- No direct relationship is established with other tables, but it indirectly connects to book_transactions, checked_out_books, and favorite_books through foreign key references.
#### Users Table (users):
- Stores information about users including username, email, password, contact details, and timestamps for creation and update.
- It has a one-to-many relationship with the book_transactions table, where a user can have multiple transactions (check out, check in, reserve).
- It also has one-to-many relationships with the checked_out_books and favorite_books tables, where a user can have multiple checked out books and favorite books.
#### Book Transactions Table (book_transactions):
- Records transactions related to books such as checking out, checking in, or reserving a book.ferencing the books and users tables.
- It has foreign key references to both the books and users tables, establishing relationships with them.
- It has a one-to-many relationship with the checked_out_books table, where multiple transactions can be recorded for a single book.
- It has a one-to-many relationship with the favorite_books table, where a user can have multiple favorite books.
#### Checked Out Books Table (checked_out_books):
- It maintains a record of books checked out by users.
- It has foreign key references to both the books and users tables, establishing relationships with them.
- It ensures that each book can only be checked out by one user at a time.
#### Favorite Books Table (favorite_books):
- It stores the favorite books of users.
- It has foreign key references to both the books and users tables, establishing relationships with them.
- It ensures that a user can have multiple favorite books but not the same book listed multiple times as a favorite.
### Data:
The books and users tables are populated with sample data including book titles, authors, ISBNs, user details, and timestamps for creation and update. I have not created dump for book_transactions, favorite_books, and checked_out_books table because it would conflict with the user_id and book_id set by postgreSQL when setting the books and users. Log into admin or user account and play around with check-in/check-out, reserve to see the above tables generating/deleting entries. Follow the steps under Installation for recreating the database.

## Routes
The Express application comprises routes for managing and authenticating users, managing/organising and performing CRUD on books, and automating circulation activities within the system.
### Users:
- GET /api/users: Retrieves all users from the database.
- POST /api/users/register: Registers a new user.
- GET /api/users/:id: Retrieves a specific user by their ID.
- POST /api/users/login: Authenticates a user for login. Used "bcrypt" for hashing passwords securely for login/register and authentication purpose, ensuring sensitive user data remains protected.
- DELETE /api/users/:id: Deletes a user account.
- PUT /api/users/:id: Edits user information.
- GET /api/users/:userId/favorite-books: Retrieves all favorite books of a specific user.
- POST /api/users/:userId/favorite-books: Adds a book to a user's favorite list.
- DELETE /api/users/:userId/favorite-books/:bookId: Removes a book from a user's favorite list.
### Books:
- GET /api/books: Retrieves all books from the database.
- POST /api/books/add: Adds a new book to the system.
- GET /api/books/:id: Retrieves a specific book by its ID.
- PUT /api/books/:id: Updates book information.
- DELETE /api/books/:id: Deletes a book from the system.
### Circulation:
- POST /api/circulation/check-out: Checks out a book to a user. It automatically assigns a 4 days later return date. If a user doesnt check-in, system will execute a query to check against overdue books and automatically check-in the books. Note: if another user has reserved this book, it will automatically assign this book to that user and book will remain checked out but should be available to reserve by others. Otherwise, book will be available to check-out immediately.
- POST /api/circulation/check-in: Checks in a book from a user. Note: if another user has reserved this book, it will automatically assign this book to that user and book will remain checked out but should be available to reserve by others.
- GET /api/circulation/checked-out-books: Retrieves all books that are currently checked out.  Used for handling reservation mechanism. Note: only checked out books are shown for reservation. Reasoning behind: If book is available, user can simply check out the book instead of reserving it. 
- GET /api/circulation/reserved-books: Retrieves all books that are currently reserved. Used for handling reservation.
- POST /api/circulation/reserve: Reserves a book for a user.
- GET /api/circulation/update_books_availability: Updates book availability based on return dates and automatically assigns books to reserved users. Necessary to handle overdue books to return.

These routes provide functionalities for managing users, books, and circulation activities, including User Authentication: registration, and login, User Management: creatin and managing (edit/delete/view) user accounts, Book Management: book acquisition/organizing, Book CRUD operations: create/edit/delete/view books, Book Circulation: automated checkout/check-in operations, and book reservation.

## Tests
The test suite includes tests for multiple components. There are currently 4 test suites and 11 tests. These tests cover various aspects of the application, including rendering, user interaction, authentication, and API communication. 
### Register Component Test:
- Verifies that the registration form renders correctly with input fields for username, email, password, and phone no.
- Ensures that the component handles form input changes accurately.
- Tests the form submission process, ensuring that the component makes the expected API call and navigates to the correct route upon successful registration.
### Home Component Test:
- Tests the rendering of different dashboard components based on the user's authentication status and role.
- Verifies that the UserDashboard component renders when a non-admin user is logged in, the AdminDashboard component renders when an admin user is logged in, and the Login component renders when no user is logged in.
### Footer Component Test:
- Checks if the footer component renders social media links correctly.
- Verifies that the copyright text is displayed accurately.
### AddBook Component Test:
- Ensures that the add book form renders with all required input fields.
- Tests the functionality to handle changes in form input fields.
- Verifies that the form submission triggers the correct API call with the expected data.

## Future Development
- More unit and integration testing
- Pagination of books and users as it can be alot.



