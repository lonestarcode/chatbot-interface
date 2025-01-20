require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
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
    db.run('CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at)');
  });
}

// Debug endpoint - Remove in production
app.get('/api/debug/users', (req, res) => {
  db.all('SELECT id, email, username, created_at FROM users', [], (err, users) => {
    if (err) {
      console.error('Debug endpoint error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ users });
  });
});

// Authentication endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Error creating user' });
        }

        const token = jwt.sign(
          { id: this.lastID },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ? COLLATE NOCASE', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
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
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ token });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Prompts endpoints
app.post('/api/prompts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'guest-token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    db.run(
      'INSERT INTO prompts (user_id, content, is_saved) VALUES (?, ?, 1)',
      [decoded.id, content],
      function(err) {
        if (err) {
          console.error('Database error when saving prompt:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id: this.lastID });
      }
    );
  } catch (error) {
    console.error('Error in save prompt endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/prompts/saved', async (req, res) => {
  try {
    console.log('Fetching saved prompts');
    console.log('Headers:', req.headers);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'guest-token') {
      console.log('Unauthorized: No token or guest token');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }

    db.all(
      'SELECT * FROM prompts WHERE user_id = ? AND is_saved = 1 ORDER BY created_at DESC',
      [decoded.id],
      (err, prompts) => {
        if (err) {
          console.error('Database error when fetching saved prompts:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        console.log('Retrieved saved prompts:', prompts);
        res.json(prompts);
      }
    );
  } catch (error) {
    console.error('Error in get saved prompts endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/prompts/recent', async (req, res) => {
  try {
    console.log('Fetching recent prompts');
    console.log('Headers:', req.headers);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'guest-token') {
      console.log('Unauthorized: No token or guest token');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }

    db.all(
      'SELECT * FROM prompts WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [decoded.id],
      (err, prompts) => {
        if (err) {
          console.error('Database error when fetching recent prompts:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        console.log('Retrieved recent prompts:', prompts);
        res.json(prompts);
      }
    );
  } catch (error) {
    console.error('Error in get recent prompts endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/prompts/:id/toggle-save', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'guest-token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const promptId = req.params.id;

    // First, verify the prompt belongs to the user
    db.get(
      'SELECT is_saved FROM prompts WHERE id = ? AND user_id = ?',
      [promptId, decoded.id],
      (err, prompt) => {
        if (err) {
          console.error('Database error when checking prompt:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!prompt) {
          return res.status(404).json({ error: 'Prompt not found' });
        }

        // Toggle the is_saved status
        const newSavedStatus = prompt.is_saved ? 0 : 1;
        db.run(
          'UPDATE prompts SET is_saved = ? WHERE id = ? AND user_id = ?',
          [newSavedStatus, promptId, decoded.id],
          (err) => {
            if (err) {
              console.error('Database error when updating prompt:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, is_saved: newSavedStatus });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error in toggle save endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});