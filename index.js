const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'student_activity_center'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse request body
app.use(bodyParser.urlencoded({ extended: false }));

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.post('/login', (req, res) => {
  const { studentId, studentName, studentUsername, studentPassword, workerId, workerName, workerType, workerUsername, workerPassword } = req.body;

  // Check if the user is a student
  if (studentId && studentName && studentUsername && studentPassword) {
    // Query the database to check if the student exists and authenticate
    const query = 'SELECT * FROM student WHERE student_id = ? AND name = ? AND user_name = ? AND password = ?';
    connection.query(query, [studentId, studentName, studentUsername, studentPassword], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        // Student found and authenticated, redirect to student.html
        res.redirect('/student.html');
      } else {
        // Student not found or authentication failed, redirect back to index.html
        res.redirect('/');
      }
    });
  }
  // Check if the user is a worker
  else if (workerId && workerName && workerType && workerUsername && workerPassword) {
    // Query the database to check if the worker exists and authenticate
    const query = 'SELECT * FROM worker WHERE worker_id = ? AND name = ? AND type = ? AND user_name = ? AND password = ?';
    connection.query(query, [workerId, workerName, workerType, workerUsername, workerPassword], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        // Worker found and authenticated, redirect to worker.html
        res.redirect('/worker.html');
      } else {
        // Worker not found or authentication failed, redirect back to index.html
        res.redirect('/');
      }
    });
  } else {
    // Invalid request, redirect back to index.html
    res.redirect('/');
  }
});