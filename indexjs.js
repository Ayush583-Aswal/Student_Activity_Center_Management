
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '#######',  //change to your mysql password
  database: 'project',  //change to your myql project name
  insecureAuth: true
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Middleware and static file serving
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const allowedStudentIds = [2201001];

app.get('/get-events', (req, res) => {
  const query = 'SELECT * FROM event';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching events', error: err });
    } else {
      res.json(results);
    }
  });
});

// Student dashboard route
app.get('/student-dashboard', (req, res) => {
  const studentId = req.query.student_id;
  res.sendFile(path.join(__dirname, 'dashboard.html'), { student_id: studentId });
});
app.post('/check-allowed-students', (req, res) => {
  const { studentId } = req.body;

  const isAllowed = allowedStudentIds.includes(parseInt(studentId));
  res.json({ isAllowed });
});
// Book activity route
app.post('/book-activity', (req, res) => {
  const { studentId, activityId, activityDate, activityTime } = req.body;

  // Insert the activity booking into the takes table
  const query = 'INSERT INTO takes (student_id, activity_id, date, time) VALUES (?, ?, ?, ?)';
  connection.query(query, [studentId, activityId, activityDate, activityTime], (err, result) => {
    if (err) {
      console.error('Error booking activity:', err);
      return res.status(500).json({ message: 'Error booking activity' });
    } else {
      return res.status(200).json({ message: 'Activity booked successfully' });
    }
  });
});

// Get signed-up activities route
app.get('/get-signed-up-activities', (req, res) => {
  const studentId = req.query.student_id;

  // Fetch the signed up activities from the takes table
  const query = 'SELECT a.activity_name AS activity, DATE_FORMAT(t.date, "%Y-%m-%d") AS formatted_date, t.time FROM takes t JOIN activity a ON t.activity_id = a.activity_id WHERE t.student_id = ?';

  connection.query(query, [studentId], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching signed up activities' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/schedule-event', (req, res) => {
  const { studentId, eventName, eventDate, eventTime, eventActivity } = req.body;

  // Check if the student ID is allowed
  if (!allowedStudentIds.includes(parseInt(studentId))) {
    return res.status(403).json({ message: 'You are not authorized to schedule events' });
  }

  // Insert the event into the event table
  const query = 'INSERT INTO event (event_name, date, time, activity_id) VALUES (?, ?, ?, ?)';
  connection.query(query, [eventName, eventDate, eventTime, eventActivity], (err, result) => {
    if (err) {
      console.error('Error scheduling event:', err);
      return res.status(500).json({ message: 'Error scheduling event' });
    } else {
      return res.status(200).json({ message: 'Event scheduled successfully' });
    }
  });
});

// Get all booked activities
app.get('/get-all-booked-activities', (req, res) => {
  const query = `
    SELECT s.student_id, u.name AS student_name, a.activity_name AS activity, DATE_FORMAT(t.date, "%Y-%m-%d") AS formatted_date, t.time
    FROM takes t
    JOIN student s ON t.student_id = s.student_id
    JOIN user u ON s.user_id = u.user_id
    JOIN activity a ON t.activity_id = a.activity_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching booked activities' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Filter booked activities
app.post('/filter-booked-activities', (req, res) => {
  const { startTime, endTime, startDate, endDate } = req.body;

  const query = `
    SELECT s.student_id, u.name AS student_name, a.activity_name AS activity, DATE_FORMAT(t.date, "%Y-%m-%d") AS formatted_date, t.time
    FROM takes t
    JOIN student s ON t.student_id = s.student_id
    JOIN user u ON s.user_id = u.user_id
    JOIN activity a ON t.activity_id = a.activity_id
    WHERE t.time BETWEEN ? AND ?
      AND t.date BETWEEN ? AND ?
  `;

  connection.query(query, [startTime, endTime, startDate, endDate], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error filtering booked activities' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Worker dashboard route
app.get('/worker-dashboard', (req, res) => {
  const workerId = req.query.worker_id;
  res.sendFile(path.join(__dirname, 'worker_Dashboard.html'), { worker_id: workerId });
});

// Student login route
app.post('/student-login', (req, res) => {
  const { studentId, studentName, studentUsername, studentPassword } = req.body;

  // Query the database to check if the student exists and authenticate
  const query = "SELECT * FROM user u JOIN student s ON u.user_id = s.user_id WHERE s.student_id = ? AND u.name = ? AND u.user_name = ? AND u.password = ?";
  connection.query(query, [studentId, studentName, studentUsername, studentPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid student credentials' });
    } else {
      return res.redirect(`/student-dashboard?student_id=${studentId}`);
    }
  });
});

// Worker login route
app.post('/worker-login', (req, res) => {
  const { workerId, workerName, workerUsername, workerPassword } = req.body;

  // Query the database to check if the worker exists and authenticate
  const query = 'SELECT u.*, w.worker_id, w.type, w.availability FROM user u JOIN worker w ON u.user_id = w.user_id WHERE w.worker_id = ? AND u.name = ? AND u.user_name = ? AND u.password = ?';
  connection.query(query, [workerId, workerName, workerUsername, workerPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid worker credentials' });
    } else {
      const workerAvailability = results[0].availability;
      const workerType = results[0].type;
      if (1) {
        return res.redirect(`/worker-dashboard?worker_id=${results[0].worker_id}&worker_type=${workerType}`);
      } else {
        return res.status(403).json({ message: 'Worker is not available' });
      }
    }
  });
});

// Update worker availability route
app.post('/update-availability', (req, res) => {
  const { workerId, workerAvailability } = req.body;

  // Update the worker availability in the worker table
  const query = 'UPDATE worker SET availability = ? WHERE worker_id = ?';
  connection.query(query, [workerAvailability, workerId], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error updating availability' });
    } else {
      res.status(200).json({ message: `Availability updated to ${workerAvailability}` });
    }
  });
});

// Update worker type route
app.post('/update-worker-type', (req, res) => {
  const { workerId, workerType, cleanerArea, cleanerDate, guardDate } = req.body;

  if (workerType === 'guard') {
    // Update the `Schedule_Worker` table for a guard
    const query = 'INSERT INTO Schedule_Worker (worker_id, date, for_) VALUES (?, ?, NULL)';
    connection.query(query, [workerId, guardDate], (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Error updating schedule' });
      } else {
        res.status(200).json({ message: 'Schedule updated successfully' });
      }
    });
  } else if (workerType === 'cleaner') {
    // Update the `Schedule_Worker` table for a cleaner
    const query = 'INSERT INTO Schedule_Worker (worker_id, date, for_) VALUES (?, ?, ?)';
    connection.query(query, [workerId, cleanerDate, cleanerArea], (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Error updating schedule' });
      } else {
        res.status(200).json({ message: 'Schedule updated successfully' });
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid worker type' });
  }
});

// Update worker schedule route
app.post('/update-schedule', (req, res) => {
  const { workerId, workerType, cleanerArea, cleanerDate, guardDate } = req.body;

  if (workerType === 'guard') {
    // Update the `Schedule_Worker` table for a guard
    const query = 'INSERT INTO schedule_worker (worker_id, date, for_) VALUES (?, ?, NULL)';
    connection.query(query, [workerId, guardDate], (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Error updating schedule' });
      } else {
        res.status(200).json({ message: 'Schedule updated successfully' });
      }
    });
  } else if (workerType === 'cleaner') {
    // Update the `Schedule_Worker` table for a cleaner
    const query = 'INSERT INTO schedule_worker (worker_id, date, for_) VALUES (?, ?, ?)';
    connection.query(query, [workerId, cleanerDate, cleanerArea], (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Error updating schedule' });
      } else {
        res.status(200).json({ message: 'Schedule updated successfully' });
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid worker type' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});