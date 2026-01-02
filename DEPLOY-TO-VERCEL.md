# Deploy Coach Dashboard to Vercel

## Quick Deploy Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub First**
   ```bash
   cd "Coach dashboard"
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Done!** Your dashboard will be live in ~2 minutes

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd "Coach dashboard"
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (e.g., `coach-dashboard`)
   - Directory? **./**
   - Override settings? **No**

5. **Production Deploy**
   ```bash
   vercel --prod
   ```

## Important Notes

### Before Deploying

1. **Change the default password!**
   - Edit `src/lib/auth.ts`
   - Change `DEFAULT_COACH_PASSWORD` from `"coach2024"`

2. **Test locally first**
   ```bash
   npm install
   npm run dev
   ```

### After Deploying

1. **Access your dashboard**
   - URL will be: `https://your-project-name.vercel.app`
   - Login at: `https://your-project-name.vercel.app/login`

2. **Keep it private!**
   - Don't share the URL publicly
   - Use a strong password
   - Consider adding additional security

## GitHub Setup (If Needed)

If you need to create a new GitHub repository:

1. **Create repo on GitHub**
   - Go to https://github.com/new
   - Name it (e.g., `coach-dashboard`)
   - Don't initialize with README
   - Click "Create repository"

2. **Push your code**
   ```bash
   cd "Coach dashboard"
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git branch -M main
   git push -u origin main
   ```

## Troubleshooting

### Build Errors
- Make sure all dependencies are in `package.json`
- Run `npm install` locally first
- Check for TypeScript errors: `npm run build`

### Login Not Working
- Verify password is set correctly in `src/lib/auth.ts`
- Check browser console for errors
- Clear localStorage if needed

### Data Not Persisting
- Remember: Data is stored in browser localStorage
- Each device/browser has separate data
- For production, consider a backend database

## Next Steps

After deployment:
1. ✅ Change default password
2. ✅ Test login functionality
3. ✅ Add your first client
4. ✅ Create a schedule
5. ✅ Test the full workflow

Your coach dashboard is ready to manage clients! 🎉

