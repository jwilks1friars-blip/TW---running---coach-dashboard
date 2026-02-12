# Setup GitHub Repository for Coach Dashboard

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `coach-dashboard` (or `TW---Coach-Dashboard` to match your pattern)
3. Description: "Coach admin dashboard for Tyler Wilks Running"
4. Make it **Private** (recommended for admin dashboard)
5. **Don't** initialize with README, .gitignore, or license
6. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repo, run these commands:

```bash
cd "Coach dashboard"

# Remove any existing remote (if needed)
git remote remove origin 2>/dev/null || true

# Add your new repository (replace with your actual repo name)
git remote add origin https://github.com/jwilks1friars-blip/coach-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your `coach-dashboard` repository
4. Vercel will auto-detect Next.js
5. Click **"Deploy"**
6. Wait 1-2 minutes
7. **Done!**

## Repository Name Options

You can use any of these names:
- `coach-dashboard` (simple)
- `TW---Coach-Dashboard` (matches your client dashboard pattern)
- `TW-Coach-Dashboard` (cleaner version)
- Any name you prefer!

Just make sure to update the `git remote add origin` command with your chosen name.


