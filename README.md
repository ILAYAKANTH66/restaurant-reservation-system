# Restaurant Reservation System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for restaurant table reservations with role-based access control.

## Features

### 🍽️ **For Customers**

- Browse restaurants with search and filtering
- View restaurant details, ratings, and availability
- Make table reservations with custom requirements
- Manage personal reservations (view, cancel)
- User profile management

### 🏪 **For Restaurant Owners**
- Restaurant management dashboard
- View and manage incoming reservations
- Update reservation status (confirm, cancel, complete)
- Restaurant profile and settings management

### 👨‍💼 **For Administrators**
- System-wide user management
- Restaurant oversight and management
- Comprehensive analytics and reporting
- System health monitoring

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Project Structure

```
restaurant-reservation
├── server/                 # Backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── client/                # Frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── index.js       # App entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-reservation
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cp env.example .env
   
   # Edit .env file with your configuration
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/restaurant-reservation
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (owner/admin)
- `PUT /api/restaurants/:id` - Update restaurant (owner/admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (owner/admin)

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/my-reservations` - Get user reservations
- `GET /api/reservations/:id` - Get reservation by ID
- `PATCH /api/reservations/:id/status` - Update reservation status
- `PATCH /api/reservations/:id/cancel` - Cancel reservation

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/role` - Update user role
- `PATCH /api/users/:id/status` - Toggle user status


## User Roles

### Customer
- Browse and search restaurants
- Make reservations
- Manage personal reservations
- Update profile

### Restaurant Owner
- Manage owned restaurants
- View and manage reservations
- Update restaurant information
- Access restaurant dashboard

### Administrator
- Full system access
- User management
- Restaurant oversight
- System analytics

## Database Models

### User
- Basic info (name, email, phone)
- Role-based access (customer, restaurant_owner, admin)
- Authentication (password, JWT tokens)
- Account status

### Restaurant
- Restaurant details (name, description, cuisine)
- Contact information (phone, email, website)
- Location and capacity
- Operating hours and features
- Owner reference

### Reservation
- Restaurant and user references
- Booking details (date, time, party size)
- Status tracking (pending, confirmed, cancelled, completed)
- Special requests and notes

## Features in Detail

### 🔍 **Search & Filtering**
- Search by restaurant name, cuisine, or description
- Filter by cuisine type, price range, and rating
- Sort by rating, name, or distance

### 📅 **Reservation System**
- Real-time availability checking
- Capacity management
- Date and time validation
- Special requests handling

### 🔐 **Security**
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization

### 📱 **Responsive Design**
- Mobile-first approach
- Modern UI with Tailwind CSS
- Intuitive user experience
- Cross-browser compatibility

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or similar platform

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or similar platform
3. Configure API endpoint URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using the MERN stack**
