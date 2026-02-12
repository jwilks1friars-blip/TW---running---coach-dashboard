# Quick Deploy to Vercel - Coach Dashboard

## ✅ Step 1: Push to GitHub

First, create a GitHub repository and push your code:

```bash
cd "Coach dashboard"

# Create a new repo on GitHub first, then:
git remote add origin https://github.com/jwilks1friars-blip/coach-dashboard.git
git branch -M main
git push -u origin main
```

**Or create a new repo:**
- Go to https://github.com/new
- Name it: `coach-dashboard` (or any name you prefer)
- Don't initialize with README
- Copy the repo URL
- Run the commands above with your repo URL

## ✅ Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign in (or create account)
3. Click **"Add New Project"**
4. Import your GitHub repository (`coach-dashboard`)
5. Vercel will auto-detect Next.js
6. Click **"Deploy"**
7. Wait 1-2 minutes
8. **Done!** Your dashboard is live

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd "Coach dashboard"
vercel

# Follow prompts, then for production:
vercel --prod
```

## ✅ Step 3: Access Your Dashboard

After deployment, you'll get a URL like:
- `https://coach-dashboard.vercel.app`
- Login at: `https://coach-dashboard.vercel.app/login`
- Default password: `coach2024` (change this!)

## ⚠️ Important: Change Password Before Going Live!

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
- ✅ Don't share the URL publicly
- ✅ Use a strong, unique password
- ✅ Keep the dashboard private

## 📝 What's Deployed

- ✅ Login page (`/login`)
- ✅ Dashboard overview (`/`)
- ✅ Client management (`/clients`)
- ✅ Schedule editor (`/schedules`)
- ✅ Notes management (`/notes`)
- ✅ Updates (`/updates`)
- ✅ Settings (`/settings`)

Your coach dashboard is ready! 🚀


