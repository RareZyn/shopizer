# Shopizer Frontend

A simple React frontend for testing the Shopizer e-commerce REST APIs.

## Features

- **Product Browsing**: View products, filter by categories, search
- **Shopping Cart**: Add to cart, update quantities, checkout
- **Customer Portal**: Registration, login, order history, profile management
- **Admin Portal**: Product management, order management, customer management
- **JWT Authentication**: Secure authentication for customers and admins

## Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Bootstrap 5** for layout
- **Ant Design** for advanced components
- **React Hook Form** for form management
- **Day.js** for date formatting

## Prerequisites

- Node.js 16+ and npm
- Shopizer backend running on `http://localhost:8081`

## Installation

```bash
# Install dependencies
npm install
```

## Running the App

```bash
# Development mode (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env.development` file (already created) with:

```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
VITE_STORE_CODE=DEFAULT
VITE_LANGUAGE=en
```

## Project Structure

```
src/
├── api/              # API service layer
├── components/       # Reusable components
├── context/          # React context providers (Auth, Cart)
├── pages/            # Page components
├── utils/            # Utility functions
└── App.jsx           # Main app with routing
```

## Usage

### Customer Features
1. **Browse Products**: Visit `/products` to see all products
2. **Register**: Create an account at `/register`
3. **Login**: Login at `/login`
4. **Shopping**: Add items to cart, checkout, view orders

### Admin Features
1. **Admin Login**: Login at `/admin/login`
2. **Manage Products**: Create, edit, delete products
3. **Manage Orders**: View and update order statuses
4. **Manage Customers**: View customer information

## API Documentation

Swagger UI: http://localhost:8081/swagger-ui.html

## Backend Setup

Ensure the Shopizer backend is running:

```bash
cd ../sm-shop
../mvnw spring-boot:run
```

The backend should be accessible at `http://localhost:8081`.

## Development Notes

- The frontend uses Vite's proxy to forward `/api` requests to the backend
- JWT tokens are stored in localStorage
- Cart code is persisted across sessions
- All API calls include `store=DEFAULT` and `lang=en` parameters

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 8081
- Check `.env.development` for correct API URL

### CORS Issues
- Backend CORS is configured to allow requests from the frontend
- Check backend `application.properties` for CORS settings

### Authentication Issues
- Clear localStorage if you encounter authentication loops
- Check browser console for detailed error messages

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory and can be served by any static file server.
