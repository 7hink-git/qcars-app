# Q-Cars Deployment Guide

Complete guide for deploying the Q-Cars platform to Supabase and Netlify.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Supabase Setup](#supabase-setup)
- [Netlify Deployment](#netlify-deployment)
- [Environment Variables](#environment-variables)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ A [Supabase](https://supabase.com) account (free tier available)
- ✅ A [Netlify](https://netlify.com) account (free tier available)
- ✅ Your Google Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey)
- ✅ Git repository with your Q-Cars code (GitHub, GitLab, or Bitbucket)

---

## Supabase Setup

### Step 1: Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: Q-Cars (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the region closest to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (~2 minutes)

### Step 2: Run Database Schema

1. In your Supabase project dashboard, navigate to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase/supabase-schema.sql` from your project
4. Copy the entire content
5. Paste it into the SQL Editor
6. Click **"Run"** or press `Ctrl/Cmd + Enter`
7. Verify success: You should see "Success. No rows returned"

### Step 3: Populate Initial Data

1. Still in the **SQL Editor**, click **"New Query"** again
2. Open the file `supabase/supabase-seed.sql` from your project
3. Copy the entire content
4. Paste it into the SQL Editor
5. Click **"Run"**
6. Verify success: You should see "Success. No rows returned"

### Step 4: Verify Tables

1. Navigate to **Table Editor** (left sidebar)
2. You should see three tables:
   - `cars` (8 rows)
   - `settings` (1 row)
   - `bookings` (0 rows)
3. Click on `cars` table to verify all 8 vehicles are loaded

### Step 5: Get Your API Credentials

1. Navigate to **Settings** → **API** (left sidebar)
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
3. Save these for the next step

> **Note**: Never commit the service_role key to version control! Use only the `anon public` key for your frontend.

---

## Netlify Deployment

### Step 1: Connect Your Repository

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your Q-Cars repository

### Step 2: Configure Build Settings

Netlify should auto-detect your settings from `netlify.toml`, but verify:

- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 (set in netlify.toml)

Click **"Show advanced"** and proceed to environment variables.

### Step 3: Set Environment Variables

In the **"Environment variables"** section, add the following:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | From Supabase Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase Settings → API |
| `GEMINI_API_KEY` | Your Google Gemini API key | From Google AI Studio |

> **Important**: The `VITE_` prefix is required for Vite to expose these variables to your frontend.

### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (~2-3 minutes)
3. Once successful, you'll get a URL like `https://random-name.netlify.app`

### Step 5: (Optional) Configure Custom Domain

1. In your site dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow the instructions to configure DNS
4. Enable HTTPS (automatic with Let's Encrypt)

---

## Environment Variables

### For Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your values:
   ```bash
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   GEMINI_API_KEY=AIza...
   ```

3. Run the development server:
   ```bash
   npm install
   npm run dev
   ```

### For Production (Netlify)

Environment variables are set in Netlify's UI:
1. Go to **Site settings** → **Environment variables**
2. Add/edit variables as needed
3. Redeploy for changes to take effect

---

## Verification

### Test Your Deployment

1. **Homepage loads**: Visit your Netlify URL
2. **Cars display**: Verify all 8 cars from Supabase are visible
3. **Search works**: Try the search functionality
4. **AI Recommendations**: Test the AI car recommendation feature
5. **Routing works**: Navigate to car details, booking pages
6. **No console errors**: Open browser DevTools and check for errors

### Common Checks

- ✅ All images load correctly
- ✅ Arabic/English language toggle works
- ✅ Booking form submits to Supabase
- ✅ WhatsApp integration links correctly
- ✅ Mobile responsive design works

---

## Troubleshooting

### Build Fails on Netlify

**Error**: `Missing environment variables`
- **Solution**: Double-check all environment variables are set correctly in Netlify

**Error**: `Module not found`
- **Solution**: Clear cache and redeploy:
  1. Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### Cars Not Loading

**Issue**: Page loads but no cars appear
- **Check 1**: Verify Supabase URL and anon key are correct
- **Check 2**: Check browser console for CORS or network errors
- **Check 3**: Verify tables were created and seeded in Supabase Table Editor
- **Check 4**: Check Supabase logs for any database errors

### AI Recommendations Not Working

**Issue**: AI feature doesn't respond
- **Check**: Verify `GEMINI_API_KEY` is set correctly
- **Check**: Ensure API key has sufficient quota
- **Check**: Check browser console for API errors

### RLS Policy Issues

**Issue**: "Row Level Security policy violation"
- **Solution**: In Supabase, go to **Authentication** → **Policies**
- Verify the public access policies are enabled (they're created in the schema)

### Deployment URL Not Working

**Issue**: Netlify URL returns 404
- **Check**: Verify `_redirects` file is in the `public/` folder
- **Check**: Verify `netlify.toml` is in the project root
- **Solution**: Redeploy the site

---

## Next Steps

After successful deployment:

1. **Monitor Performance**: Use Netlify Analytics to track usage
2. **Set Up Monitoring**: Configure Supabase alerts for database issues
3. **Enable Authentication**: Add user authentication for bookings (optional)
4. **Restrict RLS Policies**: Lock down booking creation to authenticated users only
5. **Backup Database**: Set up regular backups in Supabase settings

---

## Support

For issues or questions:
- **Supabase Docs**: https://supabase.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev/guide

---

**Deployment complete! Your Q-Cars platform is now live! 🚗✨**
