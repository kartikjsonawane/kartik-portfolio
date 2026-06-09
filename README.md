# Kartik Sonawane — Portfolio

> AI/ML Engineer & Full-Stack Developer · Final-year B.Tech CSE (AI & ML)

**Live:** [kartik-portfolio-pearl-two.vercel.app](https://kartik-portfolio-pearl-two.vercel.app) &nbsp;|&nbsp; **API:** [kartik-portfolio-5ow5.onrender.com](https://kartik-portfolio-5ow5.onrender.com)

---

## What's inside

A full-stack portfolio with a CMS, blog, real-time chat, admin dashboard, and an AI chatbot — built to impress recruiters at top tech companies.

### Pages
- **Home** — animated hero, GitHub stats, featured projects
- **About** — interactive timeline, certifications, career goals
- **Skills** — filterable skill cards with proficiency visualization
- **Projects** — full case studies for DevConnect, VisionTrack, CropMD
- **Experience** — internship timeline with highlights
- **Blog** — admin-managed posts with comments and likes
- **Contact** — contact form with email integration
- **Chat** — real-time Socket.io chat (authenticated users)

### Features
- 🤖 **Ask Kartik AI** — floating chatbot powered by Groq (Llama 3.3 70B)
- ⌨️ **Command Palette** — `Ctrl+K` to search and navigate
- 🌓 **Dark / Light Mode** — persisted to localStorage
- 🔐 **Auth System** — JWT, register/login, admin role
- 📝 **Admin Dashboard** — create/edit posts, manage projects, moderate comments
- 💬 **Real-time Chat** — Socket.io with typing indicators
- 📊 **GitHub Stats** — live GitHub API integration
- 📱 **Mobile-first** — fully responsive at all breakpoints

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (access tokens + cookies) |
| AI Chatbot | Groq API — Llama 3.3 70B Versatile |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
kartik-portfolio/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── pages/             # All page components
│   │   │   ├── admin/         # Dashboard, PostEditor, ProjectManager
│   │   │   └── auth/          # Login, Register
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── chatbot/       # AskKartik AI widget
│   │   │   └── ui/            # CommandPalette, PageTransition, ScrollToTop
│   │   ├── contexts/          # AuthContext, ThemeContext
│   │   ├── services/          # api.ts (axios), socket.ts (Socket.io)
│   │   └── data/              # portfolio.ts — all content in one file
│   ├── vercel.json
│   └── .env.example
│
└── backend/                   # Node.js + Express API
    ├── src/
    │   ├── server.js          # Entry point + Socket.io
    │   ├── routes/            # auth, posts, projects, comments, chat, contact, chatbot
    │   ├── models/            # User, Post, Project, Comment, Message
    │   ├── middleware/        # auth.js (JWT verify)
    │   └── socket/            # index.js (real-time chat handler)
    ├── render.yaml
    └── .env.example
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Clone & Install

```bash
git clone https://github.com/kartikjsonawane/kartik-portfolio.git
cd kartik-portfolio

# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

### 2. Configure Environment

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

### 4. Create Admin Account

1. Register at `http://localhost:5173/register`
2. In MongoDB Atlas, update your user: `db.users.updateOne({ email: "you@email.com" }, { $set: { role: "admin" } })`
3. Log in and access the admin dashboard at `/admin`

---

## Deployment

### Backend → Render

1. New Web Service → connect repo
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Environment variables:

```
NODE_ENV=production
MONGODB_URI=<your atlas uri>
JWT_SECRET=<your secret>
JWT_EXPIRES_IN=7d
GROQ_API_KEY=<your groq key>
FRONTEND_URL=https://kartik-portfolio-pearl-two.vercel.app
```

### Frontend → Vercel

1. New Project → connect repo
2. **Root Directory:** `frontend`
3. Environment variable: `VITE_API_URL=https://kartik-portfolio-5ow5.onrender.com`
4. Deploy — `vercel.json` handles SPA routing automatically

---

## Updating Content

All portfolio content lives in **one file**: `frontend/src/data/portfolio.ts`

- `PROFILE` — name, bio, links, resume URL
- `SKILLS` — skills with proficiency levels and project tags
- `PROJECTS` — full case study data (architecture, challenges, results)
- `EXPERIENCE` — internship details and highlights
- `CERTIFICATIONS` — certificates and credentials
- `STATS` — numbers shown on the home page

To update the AI chatbot's knowledge, edit `SYSTEM_PROMPT` in `backend/src/routes/chatbot.js`.

---

## Contact

**Kartik Sonawane** — [kartikjaywantsonawane@gmail.com](mailto:kartikjaywantsonawane@gmail.com)

[LinkedIn](https://linkedin.com/in/kartiksonawane) · [GitHub](https://github.com/kartikjsonawane)
