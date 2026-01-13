# Google OAuth Integration Setup

## 1. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add these URLs:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `https://leeikufjjlbalysngytt.supabase.co/auth/v1/callback`
7. Copy your **Client ID** and **Client Secret**

## 2. Configure Supabase

1. Go to your Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and enable it
3. Enter your Google OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
4. Use the callback URL: `https://leeikufjjlbalysngytt.supabase.co/auth/v1/callback`
5. Save the configuration

## 3. Install Dependencies

```bash
cd frontend
npm install
```

This will install `@supabase/supabase-js` package.

## 4. Environment Variables

Your frontend `.env` file is already configured with:
```
REACT_APP_SUPABASE_URL=https://leeikufjjlbalysngytt.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_hEkH5rRY_7g9v5fuXLtYHw_5b_KTXUI
```

## 5. How Google Sign-In Works

1. User clicks "Continue with Google" button
2. Redirected to Google OAuth consent screen
3. After authorization, redirected back to your app
4. Frontend sends the OAuth token to backend at `/api/auth/google`
5. Backend automatically:
   - Verifies the token with Supabase
   - Checks if user has a profile
   - **Creates a new profile automatically** if it's a first-time Google user (with 'intern' role)
   - Returns user data to frontend
6. User is logged in

## 6. First-Time Google Users

**No manual setup needed!** The backend now automatically creates profiles for new Google users with these defaults:
- **Role**: `intern`
- **Full Name**: Extracted from Google account or email

If you need to change a user's role to 'coordinator':
```sql
UPDATE profiles 
SET role = 'coordinator' 
WHERE id = 'USER_UUID_HERE';
```

## 7. Testing

1. Start your frontend: `npm start`
2. Click "Continue with Google"
3. Sign in with your Google account
4. You'll be redirected back and logged in automatically

## Notes

- Google sign-in only appears on the login screen (not signup)
- Apple sign-in has been removed
- Users can still use email/password authentication
