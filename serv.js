const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware to enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, '/'), { index: false }));

// Setup MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '#######',  //change to your mysql password
    database: 'project',  //change to your myql project name
    insecureAuth: true
  });
  

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to database');
});

// Route to fetch events
app.get('/api/events', (req, res) => {
    const query = 'SELECT event_id, event_name, date, time FROM event';
    //const query = 'SELECT event_id, event_name, date, time FROM event WHERE date >= CURDATE()';

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching events from database');
            return;
        }
        // Format each event date
        const formattedResults = results.map(event => ({
            ...event,
            date: event.date.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
        }));
        res.json(formattedResults);
    });
});


// Serve your HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// If using Express 4.16+ you can use express.static to serve all static files from a folder, avoiding individual routes for them.
// app.use(express.static(path.join(__dirname, 'public')));

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
