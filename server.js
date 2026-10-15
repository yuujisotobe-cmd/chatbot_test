const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./chatbot.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS user_inputs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/hello', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.run(
    `INSERT INTO user_inputs (name, message) VALUES (?, ?)`,
    [name, `Hello, ${name}`],
    function(err) {
      if (err) {
        console.error('Error inserting into database:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: `Hello, ${name}` });
    }
  );
});

app.post('/api/message', (req, res) => {
  const { name, message } = req.body;
  
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  db.run(
    `INSERT INTO user_inputs (name, message) VALUES (?, ?)`,
    [name, message],
    function(err) {
      if (err) {
        console.error('Error inserting into database:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get('/api/messages', (req, res) => {
  db.all(`SELECT * FROM user_inputs ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) {
      console.error('Error fetching messages:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
