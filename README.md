GameZone - Gaming Store

A modern gaming store application built with React, TypeScript, and Vite.

- Features

-  Browse and search games
-  User registration and authentication
-  Purchase games
-  Game reviews and comments
-  Admin dashboard with comprehensive analytics
-  Profit reports and user management
-  Game trailers and media

- Getting Started

- Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

- Running the Application

- Option 1: Run both servers simultaneously (Recommended)
```bash
npm run dev:all
```
This will start both the React development server and the JSON database server.

- Option 2: Run servers separately
In one terminal:
```bash
npm run server
```
This starts the JSON database server on port 3002.

In another terminal:
```bash
npm run dev
```
This starts the React development server.

-- Database

The application uses JSON Server as a mock database. The database file (`db.json`) contains:
- Users (with roles: user, moderator, admin)
- Games (with pricing, descriptions, and media)
- Comments and reviews
- Purchase history

-- Admin Access

Default admin credentials:
- Username: `admin`
- Password: `admin123`

--- Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context for state management
├── pages/              # Page components
└── assets/             # Static assets
```

--- Technologies Used

- React 19
- TypeScript
- Vite
- JSON Server
- Axios
- React Router
- CSS Modules

--- Development

- The application automatically refreshes data when switching between admin dashboard tabs
- User statistics are calculated in real-time based on purchase data
- All CRUD operations are connected to the JSON database
