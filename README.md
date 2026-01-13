# Triple G BuildHub – OJT Attendance System

A centralized attendance dashboard system for interns and coordinators with real-time monitoring, photo documentation, and automatic status tracking.

## 🎨 Features

### Intern Dashboard
- Auto-fetched full name display
- Daily attendance status (On-Time/Late/Overtime)
- Time In/Out tracking
- Overtime logging (7:00 PM - 10:00 PM)
- Photo documentation per entry

### Head Coordinator Dashboard
- View all interns' attendance records
- Real-time monitoring
- Photo verification
- Transparent attendance tracking

## 🔧 Tech Stack

- **Backend**: Node.js, Express, Supabase
- **Frontend**: React
- **Authentication**: Supabase Auth
- **File Upload**: Multer

## 📦 Installation

### 1. Supabase Setup

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions.

**Quick steps:**
1. Run `schema.sql` in Supabase SQL Editor
2. Create users in Authentication panel
3. Add profiles with user UUIDs

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

App runs on `http://localhost:3000`

## 🔐 Default Credentials

**Head Coordinator:**
- Email: `coordinator@tripleg.com`
- Password: `admin123`

**Intern:**
- Email: `intern1@tripleg.com`
- Password: `intern123`

## 📋 Attendance Rules

- **Time In**: 8:00 AM (Late after 8:05 AM)
- **Time Out**: 5:00 PM
- **Overtime**: 7:00 PM - 10:00 PM

## 🎨 Design

Uses official Triple G BuildHub color palette:
- Background: `#00273C` (Dark Navy Blue)
- Accent: `#FF7120` (Orange)
- Secondary: `#003a5c`

## 📁 Project Structure

```
tripleGattendance/
├── backend/
│   ├── server.js          # Express API
│   ├── schema.sql         # Supabase schema
│   ├── .env               # Supabase credentials
│   ├── package.json
│   └── uploads/           # Attendance photos
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Triple G styling
│   │   └── index.js
│   ├── public/
│   └── package.json
└── SUPABASE_SETUP.md      # Setup guide
```

## 🚀 Usage

1. Login with credentials
2. **Interns**: Check in with photo, check out, log overtime
3. **Coordinators**: Monitor all attendance records in real-time

## 📸 Photo Documentation

Each check-in requires photo upload for verification and accountability.
