# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Create a Vercel account at https://vercel.com

## Deploy Backend (API)

1. Navigate to backend folder:
```bash
cd backend
```

2. Deploy to Vercel:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: `tripleg-attendance-api`
   - Directory: `./`
   - Override settings? **N**

4. Add environment variables in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add:
     - `SUPABASE_URL` = `https://leeikufjjlbalysngytt.supabase.co`
     - `SUPABASE_KEY` = `your_service_role_key`
     - `PORT` = `5000`

5. Redeploy after adding env vars:
```bash
vercel --prod
```

6. Note your API URL (e.g., `https://tripleg-attendance-api.vercel.app`)

## Deploy Frontend

1. Navigate to frontend folder:
```bash
cd ../frontend
```

2. Update API URL in your code:
   - Create `.env.production` file:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_SUPABASE_URL=https://leeikufjjlbalysngytt.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

3. Deploy to Vercel:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: `tripleg-attendance`
   - Directory: `./`
   - Override settings? **N**

5. Add environment variables in Vercel Dashboard:
   - `REACT_APP_API_URL` = `https://your-backend-url.vercel.app/api`
   - `REACT_APP_SUPABASE_URL` = `https://leeikufjjlbalysngytt.supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY` = `your_anon_key`

6. Deploy to production:
```bash
vercel --prod
```

## Quick Deploy (Alternative)

Push to GitHub and connect to Vercel:

1. Push your code to GitHub (already done)

2. Go to https://vercel.com/new

3. Import your GitHub repository

4. Configure:
   - **Backend**: Root Directory = `backend`
   - **Frontend**: Root Directory = `frontend`

5. Add environment variables in Vercel dashboard

6. Deploy!

## Important Notes

- Update CORS settings in backend to allow your Vercel frontend URL
- Update API URL in frontend to point to your deployed backend
- Make sure all environment variables are set in Vercel dashboard
- Supabase storage buckets must be public for images to load

## Post-Deployment

1. Test all features
2. Update README with live URLs
3. Monitor logs in Vercel dashboard