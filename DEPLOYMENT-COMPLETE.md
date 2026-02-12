# ✅ Coach Dashboard - Deployment Complete!

## GitHub Repository
✅ Code pushed to: https://github.com/jwilks1friars-blip/TW---running---coach-dashboard

## Next Step: Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in (or create account)

2. **Import Project**
   - Click **"Add New Project"**
   - Click **"Import Git Repository"**
   - Find and select: `TW---running---coach-dashboard`
   - Click **"Import"**

3. **Configure Project**
   - Vercel will auto-detect Next.js ✅
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
   - Install Command: `npm install` (auto)

4. **Deploy**
   - Click **"Deploy"**
   - Wait 1-2 minutes for build
   - **Done!** 🎉

5. **Get Your URL**
   - After deployment, you'll get a URL like:
   - `https://tw-running-coach-dashboard.vercel.app`
   - Login at: `https://tw-running-coach-dashboard.vercel.app/login`

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
cd "Coach dashboard"
vercel

# Follow prompts, then for production:
vercel --prod
```

## ⚠️ Important: Change Password!

Before using in production:

1. Edit `src/lib/auth.ts`
2. Change `DEFAULT_COACH_PASSWORD = "coach2024"` to your secure password
3. Commit and push:
   ```bash
   git add src/lib/auth.ts
   git commit -m "Change default password"
   git push
   ```
4. Vercel will auto-redeploy

## 🔒 Security Tips

- ✅ Change default password immediately
- ✅ Keep the dashboard URL private
- ✅ Use a strong, unique password
- ✅ Consider making the repository private

## 📝 What's Deployed

- ✅ Login page (`/login`) - Password: `coach2024` (change this!)
- ✅ Dashboard overview (`/`)
- ✅ Client management (`/clients`)
- ✅ Schedule editor (`/schedules`)
- ✅ Notes management (`/notes`)
- ✅ Updates (`/updates`)
- ✅ Settings (`/settings`)

## 🎯 After Deployment

1. **Test Login**
   - Visit your Vercel URL
   - Go to `/login`
   - Use password: `coach2024` (change this!)

2. **Add Your First Client**
   - Go to `/clients`
   - Click "Add Client"
   - Fill in email, name, password

3. **Create a Schedule**
   - Go to `/schedules`
   - Select a client
   - Add workouts for the week

4. **Test Full Workflow**
   - Add notes
   - Post updates
   - Verify everything works

Your coach dashboard is ready to manage clients! 🚀


