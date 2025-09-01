const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const superadminRoutes = require('./routes/superadmin');
const maintenanceRoutes = require('./routes/maintenance');
const { checkMaintenanceMode } = require('./middlewares/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded photos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public maintenance check route (no auth required)
app.use('/api/maintenance', maintenanceRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', checkMaintenanceMode, profileRoutes);
app.use('/api/superadmin', checkMaintenanceMode, superadminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'KES Alumni Portal API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      superadmin: '/api/superadmin',
      maintenance: '/api/maintenance'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});