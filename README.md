# Wash - Laundry Service Platform

A comprehensive laundry service platform built with React.js, featuring customer and admin portals, order management, and real-time status tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

### Customer Portal

- **User Authentication**: Secure registration and login.
- **Service Booking**: Order laundry services with customizable options.
- **Order Tracking**: Real-time status updates (e.g., Pending, Processing, Ready, Delivered).
- **Order History**: View past and current orders.
- **Profile Management**: Update personal information and address.

### Admin Portal

- **Dashboard**: Overview of all orders, revenue, and service requests.
- **Order Management**: View, filter, and update order statuses.
- **User Management**: Manage customer accounts.
- **Service Management**: Configure laundry services and pricing.
- **Notifications**: Receive alerts for new orders and updates.

## Tech Stack

### Frontend

- **Framework**: React.js v19
- **Language**: JavaScript (ES6+)
- **Styling**: Vanilla CSS
- **Build Tool**: Vite

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Middleware**:
  - `bcryptjs` for password hashing
  - `multer` for file uploads

### Additional

- **API Testing**: Postman
- **Version Control**: Git & GitHub

## Project Structure

```
wash/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Auth, error handling, etc.
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── server.js       # Express app entry point
│   └── package.json    # Backend dependencies
│
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context for global state
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point
│
├── .gitignore          # Git ignore rules
├── package.json        # Root dependencies
├── README.md           # Project documentation
└── vite.config.js      # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB (local or cloud like Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rammohanrao8/wash.git
   cd wash
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Create .env file based on .env.example
   cp .env.example .env

   # Edit .env with your MongoDB URI and other variables
   # PORT=5000
   # MONGODB_URI=mongodb://localhost:27017/wash
   # JWT_SECRET=your_secret_key
   ```

3. **Start the Backend**

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:5000`.

4. **Frontend Setup**

   ```bash
   cd ../src
   npm install

   # Edit .env in src/ for API base URL
   # VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the Frontend**

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:5173`.

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd src
npm test
```

## API Endpoints

The backend provides the following RESTful API endpoints (prefix: `/api`):

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile

### Orders

- `GET /orders` - Get all orders (admin) or user's orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create a new order
- `PUT /orders/:id` - Update order status (admin)
- `DELETE /orders/:id` - Cancel an order (user)

### Services

- `GET /services` - List available services
- `POST /services` - Create new service (admin)
- `PUT /services/:id` - Update service (admin)
- `DELETE /services/:id` - Delete service (admin)

### Users

- `GET /users` - List all users (admin)
- `PUT /users/:id` - Update user profile (admin)

## Deployment

### Deploying Backend

```bash
cd backend
npm run build  # If needed

# Deploy to platforms like Heroku, Render, or AWS
```

### Deploying Frontend

```bash
cd src
npm run build

# Deploy the 'dist' folder to static hosting
# Platforms: Netlify, Vercel, GitHub Pages, Firebase Hosting
```

## Contributing

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- **Author**: [Your Name]
- **Email**: [Your Email]
- **GitHub**: [Your GitHub Profile]
