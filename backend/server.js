// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken"); // Import jsonwebtoken library

// Create an Express app
const app = express();


// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Mock user database
const users = [
    { username: 'dikshit', password: 'password123' },
    { username: 'admin', password: 'admin123' }
];

// Secret key for signing JWTs
const SECRET_KEY = "demosecretkey"; // Replace with a secure key in production


// Login API endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Check if user exists in the database
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Generate a JWT token
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        // Successful login
        return res.status(200).json({ success: true, message: 'Login successful!' });
    } else {
        // Invalid credentials
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

// Protected route example
app.get('/api/protected', (req, res) => {
    // Get token from Authorization header
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);
        return res.status(200).json({ success: true, message: `Hello ${decoded.username}, you have access!` });
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid token.' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Login API with JWT is running...');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
