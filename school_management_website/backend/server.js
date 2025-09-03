

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');


const app = express();
app.use(cors());
app.use(express.json());

// Auth routes (login/register/verify)
app.use('/api', authRoutes);

// Admin-related routes
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
