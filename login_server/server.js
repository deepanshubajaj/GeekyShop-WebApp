// MongoDB Configuration
require('./config/db');

// CORS Configuration
const cors = require('cors');

// Import express properly
const express = require('express'); 

// Create the app instance
const app = express();
const port = process.env.PORT;

// Import the User Router
const UserRouter = require('./api/apiRouter-Index');

// Enable CORS for all routes
app.use(cors());

// For accepting JSON data in POST requests
app.use(express.json()); // Automatically parses incoming JSON data

// Define routes for the all API's 
app.use('/user', UserRouter);

// Root route for health check or ping
app.get('/', (req, res) => {
    res.send('✅ GeekyShop Backend is running on Render!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
