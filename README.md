# Coach Dashboard

A modern, comprehensive admin dashboard for managing clients, schedules, notes, and updates.

## Features

- **Client Management** - Add, edit, and delete clients
- **Schedule Editor** - Create and edit weekly training schedules for each client
- **Notes Management** - Add personal notes and feedback for clients
- **Updates** - Post announcements and updates to clients
- **Modern UI** - Built with Next.js, TypeScript, and shadcn/ui
- **Secure** - Password-protected coach access

## Quick Start

### 1. Install Dependencies

```bash
cd "Coach dashboard"
npm install
```

### 2. Initialize shadcn/ui

```bash
npx shadcn@latest init
```

This will use the existing `components.json` configuration.

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Default Login

- **Password:** `coach2024`

**⚠️ IMPORTANT:** Change this password in `src/lib/auth.ts` before going live!

## Pages

- `/` - Dashboard overview
- `/login` - Coach login page
- `/clients` - Manage clients (add, edit, delete)
- `/schedules` - Edit client training schedules
- `/notes` - Add and manage coach notes
- `/updates` - Post updates to clients
- `/settings` - Account settings

## Data Storage

Uses the same localStorage system as the client dashboard:
- Client credentials stored in `clientCredentials`
- Schedules stored per client and week
- Notes and updates stored per client
- Data is compatible with the client dashboard

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Deploy

Or use Vercel CLI:

```bash
vercel
```

## Security

- Password-protected access
- Change default password before production
- Keep admin portal private (don't link publicly)
- Consider adding additional authentication for production

## Next Steps

1. Install dependencies: `npm install`
2. Initialize shadcn/ui: `npx shadcn@latest init`
3. Change default password in `src/lib/auth.ts`
4. Start building: `npm run dev`

Enjoy managing your clients! 🎉

