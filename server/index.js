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
const adminRoutes = require('./routes/admin');
const maintenanceRoutes = require('./routes/maintenance');
const newsRoutes = require('./routes/news');
const alumniGlobeRoutes = require('./routes/alumniGlobe');
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
app.use('/api/admin', checkMaintenanceMode, adminRoutes);
app.use('/api/news', checkMaintenanceMode, newsRoutes);
app.use('/api/alumni-globe', checkMaintenanceMode, alumniGlobeRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Alumni Portal API is running');
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