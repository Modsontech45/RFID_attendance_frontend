require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const adminRoutes = require('./users-routes/admin');
const teacherRoutes = require('./users-routes/teacher');
const resetPasswordRoutes = require('./users-routes/reset-password')
const deviceRoutes = require('./devices/registerdevice'); // adjust path as needed
const categoryRoutes = require('./category/categories');

const app = express();
const port = 3000;

// Fixed CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'http://localhost:5173',
  'https://rfid-attendance-synctuario-theta.vercel.app',
  'https://rfid-attendancesystem-backend-project.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check if origin matches WebContainer pattern
    if (origin && /\.webcontainer-api\.io$/.test(origin)) {
      return callback(null, true);
    }
    
    // Check if origin matches localhost with any port
    if (origin && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    
    console.log('❌ CORS blocked origin:', origin);
    callback(new Error('CORS not allowed for this origin'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'x-api-key'],
  credentials: false,
}));

// Add explicit OPTIONS handler
app.options('*', cors());

app.use(bodyParser.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/reset', resetPasswordRoutes);

app.use('/api/students', require('./student-routes/students'));
app.use('/api/attendance', require('./student-routes/attendance'));
app.use('/api/scan', require('./student-routes/scan'));
app.use('/api/register', require('./student-routes/register'));

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});