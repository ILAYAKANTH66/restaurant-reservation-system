import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import MyReservations from './pages/MyReservations';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading, isAuthenticated, isAdmin, isRestaurantOwner } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login " element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          
          {/* Protected Routes */}
          <Route 
            path="/my-reservations" 
            element={isAuthenticated ? <MyReservations /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} 
          />
          
          {/* Restaurant Owner Routes */}
          <Route 
            path="/restaurant-dashboard" 
            element={isRestaurantOwner ? <RestaurantDashboard /> : <Navigate to="/" />} 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
