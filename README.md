# Kartik Sonawane — Portfolio

Premium personal portfolio for **Kartik Sonawane**, AI/ML Engineer & Full-Stack Developer.

Built with React + Vite + Tailwind CSS (frontend) and Node.js + Express + MongoDB (backend), with an AI chatbot powered by Google Gemini.

---

## Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend   | Node.js, Express.js |
| Database  | MongoDB Atlas (Mongoose) |
| AI Chatbot| Google Gemini 1.5 Flash |
| Deployment| Vercel (frontend) + Render (backend) |

---

## Project Structure

```
kartik-portfolio/
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── pages/         # Home, About, Skills, Projects, Experience, Blog, Contact
│   │   ├── components/
│   │   │   ├── layout/    # Navbar, Footer
│   │   │   ├── home/      # GitHubStats
│   │   │   ├── chatbot/   # AskKartik AI chatbot
│   │   │   └── ui/        # CommandPalette, PageTransition
│   │   ├── data/          # portfolio.ts — all content in one place
│   │   ├── hooks/         # useCommandPalette, useScrollAnimation
│   │   └── utils/         # cn.ts
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
└── backend/               # Node.js + Express API
    ├── src/
    │   ├── server.js      # Entry point
    │   ├── routes/
    │   │   ├── contact.js    # POST /api/contact
    │   │   ├── chatbot.js    # POST /api/chatbot (Gemini)
    │   │   └── analytics.js  # POST /api/analytics/pageview
    │   └── models/
    │       ├── Contact.js
    │       ├── ChatSession.js
    │       └── Visitor.js
    ├── .env.example
    └── package.json
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at [ai.google.dev](https://ai.google.dev))

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables

**Frontend** — copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:5000
```

**Backend** — copy `.env.example` to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173`

---

## Customization

### Updating Content
All portfolio content lives in **one file**: `frontend/src/data/portfolio.ts`

- `PROFILE` — name, bio, social links, resume URL
- `SKILLS` — all skills with proficiency, years, and project tags
- `PROJECTS` — full case study data for each project
- `EXPERIENCE` — internship details
- `CERTIFICATIONS` — certificates

### Adding Your Resume
Place your resume PDF at `frontend/public/Kartik_Sonawane_Resume.pdf`

### Updating the AI Chatbot Knowledge Base
Edit the `KARTIK_KB` string in `backend/src/routes/chatbot.js` to keep the chatbot current.

---

## Deployment

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import repo in Vercel
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy

`vercel.json` handles React Router SPA routing automatically.

### Backend → Render

1. Push `backend/` to GitHub
2. Create new **Web Service** on Render
3. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   GEMINI_API_KEY=...
   FRONTEND_URL=https://kartiksonawane.vercel.app
   NODE_ENV=production
   ```
4. Start command: `npm start`

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create database user and get connection string
3. Whitelist `0.0.0.0/0` for Render's dynamic IPs (or use Render's static IP)

---

## Features

- **7 Pages**: Home, About, Skills, Projects (+ 3 detailed case studies), Experience, Blog, Contact
- **Command Palette**: `Ctrl+K` / `Cmd+K` to search and navigate
- **Ask Kartik AI Chatbot**: Floating chatbot powered by Gemini 1.5 Flash with full knowledge base
- **GitHub Stats**: Live public profile data via GitHub API
- **Animated UI**: Framer Motion page transitions, scroll animations, interactive skill cards
- **Dark Mode**: Dark by default, premium design inspired by Linear/Vercel/Stripe
- **Mobile-First**: Fully responsive at all breakpoints
- **SEO Ready**: Open Graph, Twitter Card, JSON-LD structured data
- **Performance**: Code splitting, lazy loading, <50ms page transitions

---

## Getting a Gemini API Key

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API key in Google AI Studio"
3. Create a key — the **free tier** supports 15 RPM and 1M tokens/day (more than enough)
4. Add to `backend/.env` as `GEMINI_API_KEY`

---

## Built By

Kartik Sonawane — [kartikjaywantsonawane@gmail.com](mailto:kartikjaywantsonawane@gmail.com)
