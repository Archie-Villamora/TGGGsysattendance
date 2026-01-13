const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database/attendance.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('intern', 'coordinator'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time_in TEXT,
    time_out TEXT,
    ot_time_in TEXT,
    ot_time_out TEXT,
    status TEXT CHECK(status IN ('On-Time', 'Late')),
    photo_path TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  const hashedPassword = bcrypt.hashSync('admin123', 10);
  const internPassword = bcrypt.hashSync('intern123', 10);

  db.run(`INSERT OR IGNORE INTO users (email, password, full_name, role) VALUES 
    ('coordinator@tripleg.com', ?, 'Head Coordinator', 'coordinator'),
    ('intern1@tripleg.com', ?, 'John Doe', 'intern'),
    ('intern2@tripleg.com', ?, 'Jane Smith', 'intern')`,
    [hashedPassword, internPassword, internPassword]
  );
});

db.close();
console.log('Database initialized successfully');
