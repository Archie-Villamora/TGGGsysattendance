# Supabase Setup Instructions

## 1. Create Database Tables

Go to your Supabase Dashboard → SQL Editor and run the `schema.sql` file.

## 2. Create Test Users

In Supabase Dashboard → Authentication → Users, create:

**Head Coordinator:**
- Email: `coordinator@tripleg.com`
- Password: `admin123`

**Intern:**
- Email: `intern1@tripleg.com`
- Password: `intern123`

## 3. Add User Profiles

After creating users in Authentication, run this SQL to add their profiles:

```sql
-- Get user IDs from auth.users table first
SELECT id, email FROM auth.users;

-- Then insert profiles (replace UUIDs with actual user IDs)
INSERT INTO profiles (id, full_name, role) VALUES
  ('COORDINATOR_UUID_HERE', 'Head Coordinator', 'coordinator'),
  ('INTERN1_UUID_HERE', 'John Doe', 'intern');
```

## 4. Environment Variables

Already configured in `backend/.env`:
- SUPABASE_URL
- SUPABASE_KEY

## 5. Start Application

```bash
cd backend
npm install
npm start

cd frontend
npm install
npm start
```

## Notes

- Row Level Security (RLS) is enabled for data protection
- Interns can only see their own attendance
- Coordinators can view all attendance records
- Photos are stored locally in `backend/uploads/`
