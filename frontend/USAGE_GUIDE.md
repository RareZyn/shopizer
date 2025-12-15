# Shopizer Frontend - Usage Guide

## Quick Start

### 1. Start the Backend
First, ensure the Shopizer backend is running:
```bash
cd ../sm-shop
../mvnw spring-boot:run
```
Wait for the backend to start on http://localhost:8080

### 2. Start the Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```
The frontend will start on http://localhost:3000

### 3. Access the Application
Open your browser to http://localhost:3000

## Testing the Features

### Customer Features

#### 1. Register a New Customer
- Click "Register" in the header or visit http://localhost:3000/register
- Fill in the registration form:
  - Email Address (required)
  - Password (required, min 6 characters)
  - First Name, Last Name (optional)
  - Billing Address with Country (required)
- Click "Register"
- You'll be automatically logged in and redirected to the products page

#### 2. Customer Login
- Click "Customer Login" or visit http://localhost:3000/login
- Use the credentials you registered with
- Upon successful login, you'll see your username in the header

#### 3. Browse Products
- Visit http://localhost:3000/products
- Use filters to search:
  - Search by Name
  - Search by SKU
  - Filter by Available only checkbox
- Click on a product to view details
- Products are displayed in a paginated grid

#### 4. View Product Details
- Click any product card
- See full product information
- Adjust quantity
- Click "Add to Cart"

#### 5. Shopping Cart
- Click the cart icon in the header to view your cart
- On the cart page:
  - Update quantities using the number input
  - Remove items with the delete button
  - See order summary with subtotal and total
  - Click "Proceed to Checkout"

#### 6. Checkout
- Fill in contact information (if not registered)
- Provide shipping address
- Select payment method (currently only COD)
- Click "Place Order"
- See order confirmation with order ID

#### 7. View Order History
- After logging in, click "My Orders" in the header
- See all your previous orders
- View order status, date, and total
- Click "View Details" to see order information

#### 8. Search Products
- Use the search bar in the header
- Type product name
- Autocomplete suggestions will appear (if backend supports it)
- Press Enter or click search icon to search

### Admin Features

#### 1. Admin Login
- Click "Admin" in the header or visit http://localhost:3000/admin/login
- Use admin credentials (contact your administrator)
- Upon login, you'll be redirected to the admin dashboard

#### 2. Admin Dashboard
- View quick access cards for:
  - Product Management
  - Order Management
  - Customer Management
- Access API documentation link
- View store as customer

#### 3. Product Management
- Click "Manage Products" from dashboard or visit http://localhost:3000/admin/products
- **Create Product:**
  - Click "Create Product"
  - Fill in required fields:
    - Product Name
    - SKU
    - Price
  - Optional fields:
    - Description
    - Quantity
    - Specifications (weight, height, width, length)
    - Available checkbox
  - Click "Create Product"
- **Edit Product:**
  - Click edit icon next to any product
  - Modify fields
  - Click "Update Product"
- **Delete Product:**
  - Click delete icon
  - Confirm deletion

#### 4. Order Management
- Visit http://localhost:3000/admin/orders
- View all customer orders
- Filter by:
  - Customer Name
  - Email
  - Status
- **Update Order Status:**
  - Use the dropdown next to each order
  - Select new status (ORDERED, PROCESSED, DELIVERED, CANCELLED)
  - Status updates automatically

#### 5. Customer Management
- Visit http://localhost:3000/admin/customers
- View all registered customers
- Search by name or email
- **View Customer Details:**
  - Click "Details" button
  - See personal information and billing address
- **Delete Customer:**
  - Click delete icon
  - Confirm deletion

## API Endpoints Being Tested

### Authentication
- `POST /api/v1/customer/register` - Customer registration
- `POST /api/v1/customer/login` - Customer login
- `POST /api/v1/private/login` - Admin login

### Products
- `GET /api/v1/products` - List products with filters
- `GET /api/v1/product/{slug}` - Get product by slug
- `POST /api/v1/private/product` - Create product (admin)
- `PUT /api/v1/private/product/{id}` - Update product (admin)
- `DELETE /api/v1/private/product/{id}` - Delete product (admin)

### Shopping Cart
- `POST /api/v1/cart` - Create cart
- `PUT /api/v1/cart/{code}` - Modify cart
- `GET /api/v1/cart/{code}` - Get cart
- `DELETE /api/v1/cart/{code}/product/{sku}` - Remove item

### Orders
- `POST /api/v1/cart/{code}/checkout` - Anonymous checkout
- `POST /api/v1/auth/cart/{code}/checkout` - Authenticated checkout
- `GET /api/v1/auth/orders` - Get customer orders
- `GET /api/v1/private/orders` - Get all orders (admin)
- `PUT /api/v1/private/orders/{id}/status` - Update order status (admin)

### Customers
- `GET /api/v1/private/customers` - List customers (admin)
- `GET /api/v1/private/customer/{id}` - Get customer details (admin)
- `DELETE /api/v1/private/customer/{id}` - Delete customer (admin)

### Search
- `POST /api/v1/search` - Search products
- `POST /api/v1/search/autocomplete` - Autocomplete

## Testing Tips

1. **Test with Sample Data:**
   - Create a few products as admin first
   - Register as a customer
   - Add products to cart
   - Complete checkout process

2. **Test Authentication Flows:**
   - Try accessing protected routes without logging in (should redirect to login)
   - Try accessing admin routes as customer (should redirect to home)
   - Test logout functionality

3. **Test Cart Persistence:**
   - Add items to cart
   - Refresh the page
   - Cart should persist (stored in localStorage)

4. **Test Error Handling:**
   - Try invalid login credentials
   - Try creating product with missing required fields
   - Check error messages display correctly

5. **Test Responsive Design:**
   - Resize browser window
   - Test on mobile device or use browser dev tools
   - Check navigation menu collapses properly

## Common Issues & Solutions

### Backend Not Running
**Error:** Network errors, "Failed to load products"
**Solution:** Ensure backend is running on port 8081

### CORS Errors
**Error:** CORS policy blocked
**Solution:** Check backend CORS configuration allows http://localhost:3000

### Cart Not Persisting
**Error:** Cart resets on refresh
**Solution:** Check browser localStorage is enabled

### Authentication Loop
**Error:** Keeps redirecting to login
**Solution:** Clear localStorage and try again:
```javascript
localStorage.clear()
```

### Images Not Showing
**Issue:** Product images show placeholders
**Solution:** This is expected if products don't have images configured

## Development Tools

### Browser DevTools
- **Console:** Check for JavaScript errors
- **Network Tab:** See API requests/responses
- **Application Tab:** View localStorage (JWT token, cart code)

### API Documentation
- Swagger UI: http://localhost:8081/swagger-ui.html
- Test endpoints directly via Swagger

## Next Steps

After testing the frontend:
1. Add real product data via admin panel
2. Test complete purchase flows
3. Customize styling in App.css
4. Add more features as needed:
   - Product categories sidebar
   - Product reviews
   - Wishlist
   - Multiple payment methods

## Support

For issues or questions:
- Check backend logs
- Check browser console for errors
- Verify API endpoints in Swagger
- Review application.properties for backend configuration
