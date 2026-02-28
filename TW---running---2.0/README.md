# Tyler Wilks Running 2.0

A modern athlete portal and coach dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Marketing Home Page** — Hero, features, and CTA sections
- **Athlete Portal** — Secure login for athletes to view training plans and coach messages
- **Responsive Design** — Mobile-first layout with a sticky nav and hamburger menu
- **Modern Stack** — Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-ready

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── globals.css
│   └── athlete/
│       └── page.tsx     # Athlete login portal
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── Hero.tsx
│       └── Features.tsx
└── lib/
    └── utils.ts
```

## Deployment

Deploy to Vercel with one click or run `npm run build` for a production build.
