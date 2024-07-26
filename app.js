const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/contentRoutes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
