# ShopKart - E-Commerce Platform

A full-stack e-commerce application built with React, Vite, Node.js, Express, and MongoDB. It features user authentication, a product catalog, a shopping cart, a wishlist, and payment integration using Razorpay.

## Features
- **User Authentication**: Secure login and registration with JWT.
- **Product Catalog**: Browse, search, and filter products by category and price.
- **Shopping Cart & Checkout**: Add items to the cart, modify quantities, and securely checkout.
- **Wishlist**: Save favorite products for later.
- **Order History**: Track past purchases.
- **Payment Gateway**: Integrated with Razorpay for secure transactions.

## Tech Stack
- **Frontend**: React.js, Vite, React Router, CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Payments**: Razorpay SDK

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas)

## Local Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy the example `.env` file to create a new `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your actual secrets (MongoDB URI, JWT secret, Razorpay keys).
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`.

## Security Notes
- `backend/.env` is ignored via `.gitignore` to prevent exposing sensitive keys and database credentials to version control. Do not commit API keys or production database URIs.

## Deployment
- The backend is configured to support cross-origin cookies for deployment on platforms like Railway.
- The frontend uses `import.meta.env.VITE_API_URL` to easily connect to the hosted backend domain (e.g., on Vercel).