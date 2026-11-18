require('dotenv').config({ path: './backend_ai/.env' });
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

const path = require('path');

require('./conn');
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        // Allow requests from all origins (localhost, EC2 IP, or custom domain)
        callback(null, true);
    }
}));

// Cloud health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

const UserRoutes = require('./Routes/user');
const ResumeRoutes = require('./Routes/resume');

app.use('/api/user',UserRoutes)
app.use('/api/resume',ResumeRoutes)


// Serve static files from the build folder
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route: send index.html for React Router
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT,()=>{
    console.log("backend is running on port",PORT)
})
