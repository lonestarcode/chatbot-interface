require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Create SQLite database connection
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Initialize tables
function initializeTables() {
  // Create tables one at a time to ensure proper order
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table ready');
      }
    });

    // Prompts table
    db.run(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        is_saved BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('Error creating prompts table:', err);
      } else {
        console.log('Prompts table ready');
      }
    });

    // Create indexes
    db.run('CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id)', (err) => {
      if (err) console.error('Error creating user_id index:', err);
    });

    db.run('CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at)', (err) => {
      if (err) console.error('Error creating created_at index:', err);
    });
  });
}

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  
  if (!req.body.username || !req.body.email || !req.body.password) {
    console.log('Missing required fields');
    return res.status(400).json({
      error: 'All fields are required'
    });
  }

  try {
    const { username, email, password } = req.body;
    console.log('Processing registration for:', { username, email });
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Check if user already exists
    db.get(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username],
      (err, existingUser) => {
        if (err) {
          console.error('Database error during user check:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingUser) {
          console.log('User already exists');
          return res.status(400).json({ error: 'User already exists' });
        }

        console.log('Creating new user...');
        
        // Insert new user
        db.run(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, password_hash],
          function(err) {
            if (err) {
              console.error('Database error during insert:', err);
              return res.status(500).json({ error: 'Error creating user' });
            }

            const userId = this.lastID;
            console.log('User created with ID:', userId);

            const token = jwt.sign(
              { id: userId },
              process.env.JWT_SECRET || 'your-secret-key',
              { expiresIn: '24h' }
            );

            res.status(201).json({
              token,
              user: {
                id: userId,
                username,
                email
              }
            });
          }
        );
      }
    );
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET || 'your-secret-key'
      );
      
      res.json({ token });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Start the server
const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server at http://localhost:${PORT}/api/test`);
}); 