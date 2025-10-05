# Restaurant Reservation System - Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `restaurant-reservation`

#### Option B: MongoDB Atlas
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster
3. Get connection string

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/restaurant-reservation
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-reservation

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Seed the Database

```bash
npm run seed
```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Restaurant owner: `owner@example.com` / `owner123`
- Customer: `customer@example.com` / `customer123`
- Sample restaurants and reservations

### 5. Start the Application

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
npm run server    # Backend only
npm run client    # Frontend only
```

## Access the Application

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

## Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. Verify network access for Atlas

### Port Conflicts
1. Change PORT in `.env` file
2. Update frontend proxy in `client/package.json`

### CORS Issues
1. Check backend CORS configuration
2. Verify frontend proxy settings

## Development

### Project Structure
```
restaurant-reservation/
├── server/                 # Backend
│   ├── config/            # Database configuration
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Helper functions
│   ├── seed/              # Database seeding
│   └── index.js           # Server entry point
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── index.js       # App entry point
│   └── package.json
└── package.json           # Root package.json
```

### Adding New Features
1. Create model in `server/models/`
2. Add routes in `server/routes/`
3. Create components in `client/src/components/`
4. Add pages in `client/src/pages/`
5. Update API service in `client/src/services/api.js`

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or production MongoDB
3. Set strong JWT_SECRET
4. Deploy to Heroku, Vercel, or similar

### Frontend
1. Build: `npm run build`
2. Deploy to Netlify, Vercel, or similar
3. Update API endpoint URLs

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs in console
3. Verify database connection
4. Check API endpoint responses
